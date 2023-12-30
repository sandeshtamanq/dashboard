import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import User from '../users/entities/user.entity';
import { OurTeam } from './entities/our-team.entity';
import { OurTeamController } from './our-team.controller';
import { OurTeamService } from './our-team.service';


@Module({
  imports: [TypeOrmModule.forFeature([OurTeam, User])],
  controllers: [OurTeamController],
  providers: [OurTeamService],
})
export class OurTeamModule {}
