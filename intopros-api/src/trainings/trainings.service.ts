import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import User from '../users/entities/user.entity';

import { generateSlug, removeFile } from '../@utils/utils';
import { Training } from './entities/trainings.entity';
import { CreateTrainingDto, UpdateTrainingDto } from './dto/trainings.dto';
import { TrainingCategory } from './entities/trainingsCategory.entity';
import {
  CreateTrainingCategoryDto,
  UpdateTrainingCategoryDto,
} from './dto/trainingsCategory.dto';
import TrainingApplication from './entities/trainingApplication.entity';
import { CreateTrainingApplicationDto } from './dto/trainingApplication.dto';

@Injectable()
export class TrainingsService {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,
    @InjectRepository(TrainingCategory)
    private readonly trainingCategoryRepository: Repository<TrainingCategory>,
    @InjectRepository(TrainingApplication)
    private readonly trainingApplicationRepository: Repository<TrainingApplication>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateTrainingDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const training = new Training();

    training.title = data.title;
    training.slug = generateSlug(data.title);
    training.description = data.description;
    training.category = data.category;
    training.createdBy = user;

    if (data.image) training.image = data.image;
    if (data.tags) training.tags = data.tags as any as string;
    if (data.publishDate) training.publishedDate = new Date(data.publishDate);
    if (data.metaDescription) training.metaDescription = data.metaDescription;
    if (data.category) training.category = data.category;

    return this.trainingRepository.save(training);
  }

  findAllAndCount(options: FindManyOptions<Training>) {
    return this.trainingRepository.findAndCount(options);
  }

  findAll(options: FindManyOptions<Training>) {
    return this.trainingRepository.find(options);
  }

  findOne(idOrSlug: number | string) {
    return this.trainingRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  async update(id: number, data: UpdateTrainingDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const training = await this.trainingRepository.findOne({ id });
    if (!training) throw new BadRequestException('training not found');

    if (data.title) {
      training.title = data.title;
      training.slug = generateSlug(data.title);
    }
    if (data.tags) training.tags = data.tags as any as string;
    if (data.description) training.description = data.description;
    if (data.category) training.category = data.category;
    if (data.publishDate) training.publishedDate = new Date(data.publishDate);
    if (data.metaDescription) training.metaDescription = data.metaDescription;
    if (data.image) {
      // Removing old image from file system
      if (training.image) removeFile(training.image);
      training.image = data.image === '{{DELETE}}' ? null : data.image;
    }
    if (Object.keys(data).includes('isActive')) {
      training.isActive = data.isActive === 'true' ? true : false;
    }

    return this.trainingRepository.save(training);
  }

  async remove(id: number) {
    const training = await this.trainingRepository.findOne({ id });
    if (!training) throw new BadRequestException('training not found');

    await this.trainingRepository.remove(training);

    // Removing old image from file system
    if (training.image) removeFile(training.image);
  }

  async createCategory(data: CreateTrainingCategoryDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const category = new TrainingCategory();

    category.slug = generateSlug(data.category);
    category.category = data.category;
    category.createdBy = user;

    return this.trainingCategoryRepository.save(category);
  }

  async updateCategory(id: number, data: UpdateTrainingCategoryDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const training = await this.trainingCategoryRepository.findOne({ id });
    if (!training) throw new BadRequestException('Career not found');

    if (data.category) {
      training.category = data.category;
      training.slug = generateSlug(data.category);
    }
    if (data.category) training.category = data.category;
    if (Object.keys(data).includes('isActive')) {
      training.isActive = data.isActive === 'true' ? true : false;
    }

    return this.trainingCategoryRepository.save(training);
  }

  async removeCategory(id: number) {
    const category = await this.trainingCategoryRepository.findOne({ id });
    if (!category) throw new BadRequestException('Career not found');

    await this.trainingCategoryRepository.remove(category);
  }

  findAllAndCountCategory(options: FindManyOptions<TrainingCategory>) {
    return this.trainingCategoryRepository.findAndCount(options);
  }

  findAllCategory(options: FindManyOptions<TrainingCategory>) {
    return this.trainingCategoryRepository.find(options);
  }

  findOneCategory(idOrSlug: number | string) {
    return this.trainingCategoryRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  async createApplications(data: CreateTrainingApplicationDto) {
    const contactItem = new TrainingApplication();
    const mergedItem = this.trainingApplicationRepository.merge(
      contactItem,
      data,
    );

    const savedCompany = await this.trainingApplicationRepository.save(
      mergedItem,
    );
    return savedCompany;
  }

  async resolveApplications(id: number, user: User) {
    const application = await this.trainingApplicationRepository.findOne(id);
    if (!application)
      throw new NotFoundException("Application doesn't exists!");

    if (application.isResolved)
      throw new BadRequestException('Application is already resolved!');

    application.isResolved = true;
    application.resolvedAt = new Date();
    application.resolvedBy = user;

    return this.trainingApplicationRepository.save(application);
  }

  findManyApplicationsWithCount(filter: FindManyOptions<TrainingApplication>) {
    return this.trainingApplicationRepository.findAndCount(filter);
  }

  findSingleApplication(id: number) {
    return this.trainingApplicationRepository.findOne(id);
  }
}
