import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import User from '../users/entities/user.entity';

import { generateSlug, removeFile } from '../@utils/utils';
import { Technologies } from './entities/technologies.entity';
import {
  CreateTechnologiesDto,
  UpdateTechnologiesDto,
} from './dto/technologies.dto';
import {
  CreateTechnologiesInfoDto,
  UpdateTechnologiesInfoDto,
} from './dto/technologiesInfo.dto';
import { TechnologiesInfo } from './entities/technologiesInfo.entity';
import { TechnologiesFramework } from './entities/technologiesFramework.entity';
import {
  CreateTechnologiesFrameworkDto,
  UpdateTechnologiesFrameworkDto,
} from './dto/technologiesFramework.dto';
import {
  CreateTechnologiesHiringMenuDto,
  UpdateTechnologiesHiringMenuDto,
} from './dto/technologiesHiringMenu.dto';
import { TechnologiesHiringMenu } from './entities/technologiesHiringMenu.entity';
import { TechnologiesFAQ } from './entities/technologiesFAQ.entity';
import {
  CreateTechnologiesFAQDto,
  UpdateTechnologiesFAQDto,
} from './dto/technologiesFAQ.dto';
import { CreateHiringApplicationDto } from './dto/technologiesHiringApplication.dto';
import HiringApplication from './entities/technologiesHiringApplication.entity';
import { info } from 'console';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technologies)
    private readonly technologiesRepository: Repository<Technologies>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TechnologiesInfo)
    private readonly technologiesInfoRepository: Repository<TechnologiesInfo>,
    @InjectRepository(TechnologiesFramework)
    private readonly technologiesFrameworksRepository: Repository<TechnologiesFramework>,
    @InjectRepository(TechnologiesFAQ)
    private readonly technologiesFAQRepository: Repository<TechnologiesFAQ>,
    @InjectRepository(TechnologiesHiringMenu)
    private readonly technologiesHiringMenuRepository: Repository<TechnologiesHiringMenu>,
    @InjectRepository(HiringApplication)
    private readonly technologiesHiringApplicationRepository: Repository<HiringApplication>,
  ) {}

  async create(data: CreateTechnologiesDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const technologies = new Technologies();

    technologies.title = data.title;
    technologies.slug = generateSlug(data.title);
    technologies.shortDescription = data.shortDescription;
    technologies.fullDescription = data.fullDescription;
    technologies.createdBy = user;

    if (data.image) technologies.image = data.image;

    return this.technologiesRepository.save(technologies);
  }

  async createInfo(data: CreateTechnologiesInfoDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const info = new TechnologiesInfo();

    info.title = data.title;
    info.slug = generateSlug(data.title);
    info.description = data.description;
    info.createdBy = user;

    if (data.image) info.image = data.image;
    if (data.technologies)
      info.technologies = data.technologies as any as string;

    return this.technologiesInfoRepository.save(info);
  }

  findAllAndCount(options: FindManyOptions<Technologies>) {
    return this.technologiesRepository.findAndCount(options);
  }

  findAllInfoAndCount(options: FindManyOptions<TechnologiesInfo>) {
    return this.technologiesInfoRepository.findAndCount(options);
  }

  findAllFrameworksAndCount(options: FindManyOptions<TechnologiesFramework>) {
    return this.technologiesFrameworksRepository.findAndCount(options);
  }

  findAllMenuAndCount(options: FindManyOptions<TechnologiesHiringMenu>) {
    return this.technologiesHiringMenuRepository.findAndCount(options);
  }

  findAllApplicationAndCount(options: FindManyOptions<HiringApplication>) {
    return this.technologiesHiringApplicationRepository.findAndCount(options);
  }

  findAllFAQAndCount(options: FindManyOptions<TechnologiesFAQ>) {
    return this.technologiesFAQRepository.findAndCount(options);
  }

  findAll(options: FindManyOptions<Technologies>) {
    return this.technologiesRepository.find(options);
  }

  findOne(idOrSlug: number | string) {
    return this.technologiesRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  findOneInfo(idOrSlug: number | string) {
    return this.technologiesInfoRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  findOneFAQ(idOrSlug: number | string) {
    return this.technologiesFAQRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
      relations: ['belongsTo'],
    });
  }

  findOneApplication(idOrSlug: number | string) {
    return this.technologiesHiringApplicationRepository.findOne({
      where: [{ id: idOrSlug }],
    });
  }

  findOneMenu(idOrSlug: number | string) {
    return this.technologiesHiringMenuRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  async update(id: number, data: UpdateTechnologiesDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const technologies = await this.technologiesRepository.findOne({ id });
    if (!technologies) throw new BadRequestException('technologies not found');

    if (data.title) {
      technologies.title = data.title;
      technologies.slug = generateSlug(data.title);
    }
    if (data.fullDescription)
      technologies.fullDescription = data.fullDescription;
    if (data.shortDescription)
      technologies.shortDescription = data.shortDescription;
    if (data.image) {
      // Removing old image from file system
      if (technologies.image) removeFile(technologies.image);
      technologies.image = data.image === '{{DELETE}}' ? null : data.image;
    }

    return this.technologiesRepository.save(technologies);
  }

  async remove(id: number) {
    const technologies = await this.technologiesRepository.findOne({ id });
    if (!technologies) throw new BadRequestException('technologies not found');

    await this.technologiesRepository.remove(technologies);

    // Removing old image from file system
    if (technologies.image) removeFile(technologies.image);
  }

  async removeApplication(id: number) {
    const technologies =
      await this.technologiesHiringApplicationRepository.findOne({ id });
    if (!technologies) throw new BadRequestException('Application not found');

    await this.technologiesHiringApplicationRepository.remove(technologies);
  }

  async updateInfo(id: number, data: UpdateTechnologiesInfoDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const info = await this.technologiesInfoRepository.findOne({ id });

    if (!info) throw new BadRequestException('Info not found');

    if (data.title) {
      info.title = data.title;
      info.slug = generateSlug(data.title);
    }
    if (data.description) info.description = data.description;
    if (data.technologies)
      info.technologies = data.technologies as any as string;

    if (data.image) {
      // Removing old image from file system
      if (info.image) removeFile(info.image);
      info.image = data.image === '{{DELETE}}' ? null : data.image;
    }

    return this.technologiesInfoRepository.save(info);
  }

  async removeInfo(id: number) {
    const info = await this.technologiesInfoRepository.findOne({ id });
    if (!info) throw new BadRequestException('info not found');

    await this.technologiesInfoRepository.remove(info);

    // Removing old image from file system
    if (info.image) removeFile(info.image);
  }

  async createFramework(data: CreateTechnologiesFrameworkDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const technology = await this.technologiesRepository.findOne({
      where: { id: data.techID },
    });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const technologies = new TechnologiesFramework();

    technologies.title = data.title;
    technologies.slug = generateSlug(data.title);
    technologies.description = data.description;
    technologies.createdBy = user;
    technologies.belongsTo = technology;
    technologies.technology = technology.title;

    if (data.image) technologies.image = data.image;

    return this.technologiesFrameworksRepository.save(technologies);
  }

  findOneFramework(idOrSlug: number | string) {
    return this.technologiesFrameworksRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
      relations: ['belongsTo'],
    });
  }

  async updateFramework(id: number, data: UpdateTechnologiesFrameworkDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const framework = await this.technologiesFrameworksRepository.findOne({
      id,
    });
    const technology = await this.technologiesRepository.findOne({
      where: { id: data.techID },
    });

    if (!framework) throw new BadRequestException('framework not found');

    if (data.title) {
      framework.title = data.title;
      framework.slug = generateSlug(data.title);
    }
    if (data.description) framework.description = data.description;

    if (!framework.belongsTo) {
      framework.belongsTo = technology;
    }

    if (data.techID) {
      framework.technology = technology.title;
    }

    if (data.image) {
      // Removing old image from file system
      if (framework.image) removeFile(framework.image);
      framework.image = data.image === '{{DELETE}}' ? null : data.image;
    }

    return this.technologiesFrameworksRepository.save(framework);
  }

  async removeFramework(id: number) {
    const framework = await this.technologiesFrameworksRepository.findOne({
      id,
    });
    if (!framework) throw new BadRequestException('framework not found');

    await this.technologiesFrameworksRepository.remove(framework);

    // Removing old image from file system
    if (framework.image) removeFile(framework.image);
  }

  async createHiringMenu(
    data: CreateTechnologiesHiringMenuDto,
    userId: number,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const menu = new TechnologiesHiringMenu();

    menu.title = data.title;
    menu.slug = generateSlug(data.title);
    menu.description = data.description;
    menu.working = data.working;
    menu.communication = data.communication;
    menu.billing = data.billing;
    menu.createdBy = user;

    return this.technologiesHiringMenuRepository.save(menu);
  }

  async removeMenu(id: number) {
    const menu = await this.technologiesHiringMenuRepository.findOne({ id });
    if (!menu) throw new BadRequestException('Menu not found');

    await this.technologiesHiringMenuRepository.remove(menu);
  }

  async updateMenu(id: number, data: UpdateTechnologiesHiringMenuDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const menu = await this.technologiesHiringMenuRepository.findOne({ id });
    if (!menu) throw new BadRequestException('menu not found');

    if (data.title) {
      menu.title = data.title;
      menu.slug = generateSlug(data.title);
    }
    if (data.description) menu.description = data.description;
    if (data.working) menu.working = data.working;
    if (data.billing) menu.billing = data.billing;
    if (data.communication) menu.communication = data.communication;

    return this.technologiesHiringMenuRepository.save(menu);
  }

  //for Technology FAQ
  async createFAQ(data: CreateTechnologiesFAQDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const technology = await this.technologiesRepository.findOne({
      where: { id: data.techID },
    });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const faq = new TechnologiesFAQ();

    faq.question = data.question;
    faq.slug = generateSlug(data.question);
    faq.answer = data.answer;
    faq.createdBy = user;
    if (data.techID) faq.belongsTo = technology;
    faq.technology = technology.title;

    return this.technologiesFAQRepository.save(faq);
  }

  async createHiringApplication(data: CreateHiringApplicationDto) {
    const hiringMenu = await this.technologiesHiringMenuRepository.findOne({
      where: { id: data.packageID },
    });
    const contactItem = new HiringApplication();

    contactItem.name = data.name;
    contactItem.email = data.email;
    contactItem.budget = data.budget;
    contactItem.tech = data.tech;
    contactItem.package = hiringMenu;
    contactItem.message = data.message;
    if (data.file) contactItem.file = data.file;

    const savedContact =
      await this.technologiesHiringApplicationRepository.save(contactItem);
    return savedContact;
  }

  async updateFAQ(id: number, data: UpdateTechnologiesFAQDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const technology = await this.technologiesRepository.findOne({
      where: { id: data.techID },
    });
    const faq = await this.technologiesFAQRepository.findOne({ id });
    if (!faq) throw new BadRequestException('FAQ not found');

    if (data.question) {
      faq.question = data.question;
      faq.slug = generateSlug(data.question);
    }
    if (data.answer) faq.answer = data.answer;
    if (data.techID) faq.belongsTo = technology;
    faq.technology = technology.title;

    return this.technologiesFAQRepository.save(faq);
  }

  async removeFAQ(id: number) {
    const faq = await this.technologiesFAQRepository.findOne({ id });
    if (!faq) throw new BadRequestException('FAQ not found');

    await this.technologiesFAQRepository.remove(faq);
  }
}
