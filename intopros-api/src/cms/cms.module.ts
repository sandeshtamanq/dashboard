import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';

import { Cms } from './entities/cms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cms])],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}
