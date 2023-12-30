import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, Repository } from 'typeorm';

import User from '../users/entities/user.entity';

import { generateSlug, removeFile } from '../@utils/utils';
import { Career } from './entities/career.entity';
import { CreateCareerDto, UpdateCareerDto } from './dto/career.dto';
import { CareerCategory } from './entities/careerCategory.entity';
import {
  CreateCareerCategoryDto,
  UpdateCareerCategoryDto,
} from './dto/careerCategory.dto';
import { CreateApplicationDto, Status } from './dto/careerApplication.dto';
import Application from './entities/careerApplication.entity';

@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
    @InjectRepository(CareerCategory)
    private readonly careerCategoryRepository: Repository<CareerCategory>,
    @InjectRepository(Application)
    private readonly careerApplicationRepository: Repository<Application>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateCareerDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const career = new Career();

    career.title = data.title;
    career.slug = generateSlug(data.title);
    career.description = data.description;
    career.category = data.category;
    career.createdBy = user;

    if (data.image) career.image = data.image;
    if (data.tags) career.tags = data.tags as any as string;
    if (data.publishDate) career.publishedDate = new Date(data.publishDate);
    if (data.metaDescription) career.metaDescription = data.metaDescription;

    const response = await this.careerRepository.save(career);
    console.log(response);
    return response;
  }

  async createCategory(data: CreateCareerCategoryDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const category = new CareerCategory();

    category.slug = generateSlug(data.category);
    category.category = data.category;
    category.createdBy = user;

    return this.careerCategoryRepository.save(category);
  }

  async updateCategory(id: number, data: UpdateCareerCategoryDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const career = await this.careerCategoryRepository.findOne({ id });
    if (!career) throw new BadRequestException('Career Category not found');

    if (data.category) {
      career.category = data.category;
      career.slug = generateSlug(data.category);
    }
    if (data.category) career.category = data.category;
    if (Object.keys(data).includes('isActive')) {
      career.isActive = data.isActive === 'true' ? true : false;
    }

    const response = await this.careerCategoryRepository.save(career);
    console.log(response);
    return response;
  }

  findAllAndCount(options: FindManyOptions<Career>) {
    return this.careerRepository.findAndCount(options);
  }

  findAll(options: FindManyOptions<Career>) {
    return this.careerRepository.find(options);
  }

  findOne(idOrSlug: number | string) {
    return this.careerRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  async update(id: number, data: UpdateCareerDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const career = await this.careerRepository.findOne({ id });
    if (!career) throw new BadRequestException('Career not found');

    if (data.title) {
      career.title = data.title;
      career.slug = generateSlug(data.title);
    }
    if (data.tags) career.tags = data.tags as any as string;
    if (data.description) career.description = data.description;
    if (data.category) career.category = data.category;
    if (data.publishDate) career.publishedDate = new Date(data.publishDate);
    if (data.metaDescription) career.metaDescription = data.metaDescription;
    if (data.image) {
      // Removing old image from file system
      if (career.image) removeFile(career.image);
      career.image = data.image === '{{DELETE}}' ? null : data.image;
    }
    if (Object.keys(data).includes('isActive')) {
      career.isActive = data.isActive === 'true' ? true : false;
    }

    return this.careerRepository.save(career);
  }

  async remove(id: number) {
    const career = await this.careerRepository.findOne({ id });
    if (!career) throw new BadRequestException('Career not found');

    await this.careerRepository.remove(career);

    // Removing old image from file system
    if (career.image) removeFile(career.image);
  }

  async removeCategory(id: number) {
    const category = await this.careerCategoryRepository.findOne({ id });
    if (!category) throw new BadRequestException('Career not found');

    await this.careerCategoryRepository.remove(category);
  }

  async removeApplication(id: number) {
    const application = await this.careerApplicationRepository.findOne({ id });
    if (!application) throw new BadRequestException('Application not found');

    await this.careerApplicationRepository.remove(application);

    // Removing old file from file system
    if (application.file) removeFile(application.file);
  }

  findAllAndCountCategory(options: FindManyOptions<CareerCategory>) {
    return this.careerCategoryRepository.findAndCount(options);
  }

  findAllCategory(options: FindManyOptions<CareerCategory>) {
    return this.careerCategoryRepository.find(options);
  }

  findOneCategory(idOrSlug: number | string) {
    return this.careerCategoryRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  async findManyApplicationsWithCount(
    applicationStatus: string,
    search: string,
    takeValue: number,
    skipValue: number,
  ) {
    const response = await this.careerApplicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.position', 'position')
      .where(
        applicationStatus === 'all'
          ? '1=1'
          : 'application.status = :applicationStatus',
        { applicationStatus },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('application.email Like :search', {
            search: `%${search}%`,
          })
            .orWhere('application.coverLetter Like :search', {
              search: `%${search}%`,
            })
            .orWhere('application.name Like :search', {
              search: `%${search}%`,
            });
        }),
      )
      .orderBy('application.createdAt', 'DESC')
      .take(takeValue)
      .skip(skipValue)
      .getManyAndCount();

    return response;
    // return this.careerApplicationRepository.findAndCount(filter);
  }

  findSingleApplication(id: number) {
    return this.careerApplicationRepository.findOne(id);
  }

  async createApplications(data: CreateApplicationDto) {
    const career = await this.careerRepository.findOne({
      where: { id: data.careerID },
    });
    const contactItem = new Application();

    contactItem.name = data.name;
    contactItem.email = data.email;
    contactItem.coverLetter = data.coverLetter;
    if (data.file) contactItem.file = data.file;
    if (data.careerID) contactItem.position = career;

    const savedContact = await this.careerApplicationRepository.save(
      contactItem,
    );
    return savedContact;
  }

  async resolveApplications(
    id: number,
    user: User,
    status: Status,
    remark?: string,
  ) {
    const application = await this.careerApplicationRepository.findOne(id);
    if (!application)
      throw new NotFoundException("Application doesn't exists!");

    // if (application.isResolved)
    //   throw new BadRequestException('Application is already resolved!');
    application.status = status;
    application.remark = remark;
    application.resolvedAt = new Date();
    application.resolvedBy = user;

    return this.careerApplicationRepository.save(application);
  }
}
