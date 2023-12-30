import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from './config.service';

import ProfileWeightage from './entities/profileWeightage.entity';
import { ProfileWeightageController } from './config-profile-weightage.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      //
      ProfileWeightage,
    ]),
  ],
  controllers: [
    ProfileWeightageController,
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
