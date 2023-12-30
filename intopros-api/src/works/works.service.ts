import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import User from '../users/entities/user.entity';

import { generateSlug, removeFile } from '../@utils/utils';
import { Works } from './entities/works.entity';
import { CreateWorksDto, UpdateWorksDto } from './dto/works.dto';

@Injectable()
export class WorksService {
  constructor(
    @InjectRepository(Works)
    private readonly worksRepository: Repository<Works>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateWorksDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const works = new Works();

    works.title = data.title;
    works.slug = generateSlug(data.title);
    works.shortDescription = data.shortDescription;
    works.description = data.description;
    works.goTo = data.goTo;
    works.createdBy = user;

    if (data.logo) works.logo = data.logo;
    if (data.banner) works.banner = data.banner;
    if (data.tags) works.tags = data.tags as any as string;
    if (data.serviceTypes)
      works.serviceTypes = data.serviceTypes as any as string;

    return this.worksRepository.save(works);
  }

  findAllAndCount(options: FindManyOptions<Works>) {
    return this.worksRepository.findAndCount(options);
  }

  findAll(options: FindManyOptions<Works>) {
    return this.worksRepository.find(options);
  }

  findOne(idOrSlug: number | string) {
    return this.worksRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  async update(id: number, data: UpdateWorksDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const works = await this.worksRepository.findOne({ id });
    if (!works) throw new BadRequestException('work not found');

    if (data.title) {
      works.title = data.title;
      works.slug = generateSlug(data.title);
    }
    if (data.description) works.description = data.description;
    if (data.goTo) works.goTo = data.goTo;
    if (data.shortDescription) works.shortDescription = data.shortDescription;
    if (data.tags) works.tags = data.tags as any as string;
    if (data.serviceTypes)
      works.serviceTypes = data.serviceTypes as any as string;
    if (data.logo) {
      // Removing old image from file system
      if (works.logo) removeFile(works.logo);
      works.logo = data.logo === '{{DELETE}}' ? null : data.logo;
    }
    if (data.banner) {
      // Removing old image from file system
      if (works.banner) removeFile(works.banner);
      works.banner = data.banner === '{{DELETE}}' ? null : data.banner;
    }
    if (Object.keys(data).includes('isActive')) {
      works.isActive = data.isActive === 'true' ? true : false;
    }
    if (Object.keys(data).includes('show')) {
      works.show = data.show === 'true' ? true : false;
    }

    return this.worksRepository.save(works);
  }

  async remove(id: number) {
    const works = await this.worksRepository.findOne({ id });
    if (!works) throw new BadRequestException('work not found');

    await this.worksRepository.remove(works);

    // Removing old image from file system
    if (works.logo) removeFile(works.logo);
    if (works.banner) removeFile(works.banner);
  }
}
