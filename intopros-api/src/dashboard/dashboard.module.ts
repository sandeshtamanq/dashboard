import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

import { UsersModule } from '../users/users.module';
import ApiLog from '../@entities/apiLog.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([ApiLog])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
