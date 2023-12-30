import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import User from '../users/entities/user.entity';

import { CreateContactUsDto } from './dto/contact-us.dto';

import ContactUs from './entities/contact-us.entity';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private readonly contactUsRepository: Repository<ContactUs>,
  ) {}

  findManyContactUsWithCount(filter: FindManyOptions<ContactUs>) {
    return this.contactUsRepository.findAndCount(filter);
  }

  findSingleContactus(id: number) {
    return this.contactUsRepository.findOne(id);
  }

  async createContactUs(data: CreateContactUsDto) {
    const contactItem = new ContactUs();

    contactItem.name = data.name;
    contactItem.email = data.email;
    contactItem.budget = data.budget;
    contactItem.tech = data.tech;
    contactItem.message = data.message;
    if(data.file) contactItem.file = data.file;

    const savedContact = await this.contactUsRepository.save(contactItem);
    return savedContact;
  }

  async resolveContactUs(id: number, user: User) {
    const contactItem = await this.contactUsRepository.findOne(id);
    if (!contactItem) throw new NotFoundException("Contact us doesn't exists!");

    if (contactItem.isResolved)
      throw new BadRequestException('Contact us is already resolved!');

    contactItem.isResolved = true;
    contactItem.resolvedAt = new Date();
    contactItem.resolvedBy = user;

    return this.contactUsRepository.save(contactItem);
  }
}
