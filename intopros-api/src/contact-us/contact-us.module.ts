import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ContactUs from './entities/contact-us.entity';

import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactUs]), UsersModule],
  controllers: [ContactUsController],
  providers: [ContactUsService],
})
export class ContactUsModule {}
