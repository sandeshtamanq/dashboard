import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Career } from './entities/career.entity';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';

import User from '../users/entities/user.entity';
import { CareerCategory } from './entities/careerCategory.entity';
import Application from './entities/careerApplication.entity';
import { UsersService } from '../users/users.service';
import UserDetail from '../users/entities/userDetail.entity';
import { SmtpService } from '../smtp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Career,
      CareerCategory,
      Application,
      User,
      UserDetail,
    ]),
  ],
  controllers: [CareerController],
  providers: [CareerService, UsersService, SmtpService],
})
export class CareerModule {}
