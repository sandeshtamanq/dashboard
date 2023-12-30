import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import User from '../users/entities/user.entity';
import { OurClient } from './entities/our-clients.entity';
import { OurClientController } from './our-clients.controller';
import { OurClientService } from './our-clients.service';


@Module({
  imports: [TypeOrmModule.forFeature([OurClient, User])],
  controllers: [OurClientController],
  providers: [OurClientService],
})
export class OurClientModule {}
