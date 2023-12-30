import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { APILogger } from './@middlewares/apiLogger.middleware';
import { GenericResponseDto, PaginatedDto } from './@utils/types';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enabling API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Logging API calls
  app.use(APILogger);

  // Serving files uploaded by users
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Validations
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Helmet for protection against well-know vulnerabilities
  app.use(helmet());

  // Enable CORS
  app.enableCors();

  // API Versioning
  app.enableVersioning({ type: VersioningType.URI });

  // OpenAPI specification
  const config = new DocumentBuilder()
    .setTitle('intopros.com')
    .setDescription('API for intopros.com')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [PaginatedDto, GenericResponseDto],
  });
  SwaggerModule.setup('swagger', app, document);

  // Starting the API
  const port = process.env.PORT;
  await app.listen(port ? +port : 3000);
}
bootstrap();
