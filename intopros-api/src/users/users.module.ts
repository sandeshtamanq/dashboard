import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';

import { SmtpService } from '../smtp.service';
import { UsersService } from './users.service';
import { UsersLogService } from './usersLog.service';
import { UserDetailService } from './usersDetail.service';

import User from './entities/user.entity';
import UserLog from './entities/userLog.entity';
import UserDetail from './entities/userDetail.entity';

import { ConfigModule } from '../config/config.module';
import ApiLog from '../@entities/apiLog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserLog,
      UserDetail,
      ApiLog,
    ]),
    ConfigModule,
  ],
  providers: [UsersService, UserDetailService, UsersLogService, SmtpService],
  exports: [UsersService, UserDetailService],
  controllers: [UsersController],
})
export class UsersModule {}
