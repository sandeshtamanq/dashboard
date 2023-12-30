import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import User from '../users/entities/user.entity';
import { Works } from './entities/works.entity';
import { WorksController } from './works.controller';
import { WorksService } from './works.service';


@Module({
  imports: [TypeOrmModule.forFeature([Works, User])],
  controllers: [WorksController],
  providers: [WorksService],
})
export class WorksModule {}
