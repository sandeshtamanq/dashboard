import { FindManyOptions, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
} from './dto/testimonial.dto';

import { Testimonial } from './entities/testimonial.entity';
import User from '../users/entities/user.entity';
import { removeFile } from '../@utils/utils';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateTestimonialDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This should never trigger');

    const testimonial = new Testimonial();

    testimonial.title = data.title;
    testimonial.name = data.name;
    testimonial.description = data.description;
    testimonial.designation = data.designation;
    if(data.image) testimonial.image = data.image;
    testimonial.createdBy = user;

    return this.testimonialRepository.save(testimonial);
  }

  findAndCountAll(options: FindManyOptions<Testimonial>) {
    return this.testimonialRepository.findAndCount(options);
  }

  findAll() {
    return this.testimonialRepository.find();
  }

  findOne(id: number) {
    return this.testimonialRepository.findOne({ id });
  }

  async update(id: number, data: UpdateTestimonialDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const testimonial = await this.testimonialRepository.findOne({ id });
    if (!testimonial) throw new BadRequestException('Testimonial not found');

    if (data.title) testimonial.title = data.title;
    if (data.name) testimonial.name = data.name;
    if (data.description) testimonial.description = data.description;
    if (data.designation) testimonial.designation = data.designation;
    if (data.image) {
      // Removing old image from file system
      if (testimonial.image) removeFile(testimonial.image);
      testimonial.image = data.image === '{{DELETE}}' ? null : data.image;
    }
    if ('isActive' in data) {
      testimonial.isActive = data.isActive;
    }

    return this.testimonialRepository.save(testimonial);
  }

  async remove(id: number) {
    const testimonial = await this.testimonialRepository.findOne({ id });
    if (!testimonial) throw new BadRequestException('Testimonial not found');

    return this.testimonialRepository.remove(testimonial);
  }
}
