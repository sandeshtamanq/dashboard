import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Blog } from './entities/blog.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';

import User from '../users/entities/user.entity';
import { BlogCategory } from './entities/blogCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog,BlogCategory, User])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
