import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { ImageCleanupTask } from './imageCleanup.task';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [ImageCleanupTask],
})
export class TasksModule {}
