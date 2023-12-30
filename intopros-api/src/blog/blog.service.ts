import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

import User from '../users/entities/user.entity';
import { Blog } from './entities/blog.entity';

import { generateSlug, removeFile } from '../@utils/utils';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dto/blogCategory.dto';
import { BlogCategory } from './entities/blogCategory.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateBlogDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const blog = new Blog();

    blog.title = data.title;
    blog.slug = generateSlug(data.title);
    blog.description = data.description;
    blog.category = data.category;
    blog.createdBy = user;

    if (data.image) blog.image = data.image;
    if (data.tags) blog.tags = data.tags as any as string;
    if (data.publishDate) blog.publishedDate = new Date(data.publishDate);
    if (data.metaDescription) blog.metaDescription = data.metaDescription;

    return this.blogRepository.save(blog);
  }

  findAllAndCount(options: FindManyOptions<Blog>) {
    return this.blogRepository.findAndCount(options);
  }

  findAll(options: FindManyOptions<Blog>) {
    return this.blogRepository.find(options);
  }

  findOne(idOrSlug: number | string) {
    return this.blogRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  findAllCategory(options: FindManyOptions<BlogCategory>) {
    return this.blogCategoryRepository.find(options);
  }

  findAllCategoryAndCount(options: FindManyOptions<BlogCategory>) {
    return this.blogCategoryRepository.findAndCount(options);
  }

  findOneCategory(idOrSlug: number | string) {
    return this.blogCategoryRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  async update(id: number, data: UpdateBlogDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const blog = await this.blogRepository.findOne({ id });
    if (!blog) throw new BadRequestException('Blog not found');

    if (data.title) {
      blog.title = data.title;
      blog.slug = generateSlug(data.title);
    }
    if (data.tags) blog.tags = data.tags as any as string;
    if (data.description) blog.description = data.description;
    if (data.category) blog.category = data.category;
    if (data.publishDate) blog.publishedDate = new Date(data.publishDate);
    if (data.metaDescription) blog.metaDescription = data.metaDescription;
    if (data.image) {
      // Removing old image from file system
      if (blog.image) removeFile(blog.image);
      blog.image = data.image === '{{DELETE}}' ? null : data.image;
    }
    if (Object.keys(data).includes('isActive')) {
      blog.isActive = data.isActive === 'true' ? true : false;
    }

    return this.blogRepository.save(blog);
  }

  async remove(id: number) {
    const blog = await this.blogRepository.findOne({ id });
    if (!blog) throw new BadRequestException('Blog not found');

    await this.blogRepository.remove(blog);

    // Removing old image from file system
    if (blog.image) removeFile(blog.image);
  }

  async createCategory(data: CreateBlogCategoryDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const category = new Blog();

    category.slug = generateSlug(data.category);
    category.category = data.category;
    category.createdBy = user;

    return this.blogCategoryRepository.save(category);
  }

  async updateCategory(id: number, data: UpdateBlogCategoryDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const category = await this.blogCategoryRepository.findOne({ id });
    if (!category) throw new BadRequestException('Blog category not found');

    if (data.category) {
      category.category = data.category;
      
      category.slug = generateSlug(data.category);
    }
    if (data.category) category.category = data.category;

    return this.blogCategoryRepository.save(category);
  }

  async removeCategory(id: number) {
    const blog = await this.blogCategoryRepository.findOne({ id });
    if (!blog) throw new BadRequestException('Category not found');

    await this.blogCategoryRepository.remove(blog);

  }
}
