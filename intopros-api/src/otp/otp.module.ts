import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import Otp from './entities/otp.entity';

import { OtpService } from './otp.service';
import User from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Otp, User])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
