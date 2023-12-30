import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import User from '../users/entities/user.entity';
import { TechnologiesController } from './technologies.controller';
import { Technologies } from './entities/technologies.entity';
import { TechnologiesService } from './technologies.service';
import { TechnologiesInfo } from './entities/technologiesInfo.entity';
import { TechnologiesFramework } from './entities/technologiesFramework.entity';
import { TechnologiesHiringMenu } from './entities/technologiesHiringMenu.entity';
import { TechnologiesFAQ } from './entities/technologiesFAQ.entity';
import HiringApplication from './entities/technologiesHiringApplication.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Technologies, User, TechnologiesInfo, TechnologiesFramework, TechnologiesHiringMenu, TechnologiesFAQ, HiringApplication])],
  controllers: [TechnologiesController],
  providers: [TechnologiesService],
})
export class TechnologiesModule {}
