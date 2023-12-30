import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';


import User from '../users/entities/user.entity';
import { Training } from './entities/trainings.entity';
import { TrainingsController } from './trainings.controller';
import { TrainingsService } from './trainings.service';
import { TrainingCategory } from './entities/trainingsCategory.entity';
import TrainingApplication from './entities/trainingApplication.entity';
import { UsersService } from '../users/users.service';
import UserDetail from '../users/entities/userDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training,TrainingCategory,TrainingApplication, User, UserDetail])],
  controllers: [TrainingsController],
  providers: [TrainingsService, UsersService],
})
export class TrainingsModule {}

