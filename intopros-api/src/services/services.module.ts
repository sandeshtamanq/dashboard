import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import User from '../users/entities/user.entity';
import { Services } from './entities/services.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Services, User])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
