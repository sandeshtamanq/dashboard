import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import User from '../users/entities/user.entity';

import { generateSlug, removeFile } from '../@utils/utils';
import { Services } from './entities/services.entity';
import { CreateServicesDto, UpdateServicesDto } from './dto/services.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateServicesDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const services = new Services();

    services.title = data.title;
    services.slug = generateSlug(data.title);
    services.shortDescription = data.shortDescription;
    services.description = data.description;
    services.createdBy = user;

    if (data.image) services.image = data.image;
    if(data.tags) services.tags = data.tags as any as string;

    return this.servicesRepository.save(services);
  }

  findAllAndCount(options: FindManyOptions<Services>) {
    return this.servicesRepository.findAndCount(options);
  }

  findAll(options: FindManyOptions<Services>) {
    return this.servicesRepository.find(options);
  }

  findOne(idOrSlug: number | string) {
    return this.servicesRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  async update(id: number, data: UpdateServicesDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const services = await this.servicesRepository.findOne({ id });
    if (!services) throw new BadRequestException('services not found');

    if (data.title) {
      services.title = data.title;
      services.slug = generateSlug(data.title);
    }
    if (data.description) services.description = data.description;
    if (data.shortDescription) services.shortDescription = data.shortDescription;
    if(data.tags) services.tags = data.tags as any as string;
    if (data.image) {
      // Removing old image from file system
      if (services.image) removeFile(services.image);
      services.image = data.image === '{{DELETE}}' ? null : data.image;
    }
    if (Object.keys(data).includes('isActive')) {
      services.isActive = data.isActive === 'true' ? true : false;
    }

    return this.servicesRepository.save(services);
  }

  async remove(id: number) {
    const services = await this.servicesRepository.findOne({ id });
    if (!services) throw new BadRequestException('services not found');

    await this.servicesRepository.remove(services);

    // Removing old image from file system
    if (services.image) removeFile(services.image);
  }
}
