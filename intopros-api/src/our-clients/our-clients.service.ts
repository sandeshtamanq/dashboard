import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import User from '../users/entities/user.entity';

import { generateSlug, removeFile } from '../@utils/utils';
import { OurClient } from './entities/our-clients.entity';
import { CreateClientsDto, UpdateClientsDto } from './dto/our-clients.dto';

@Injectable()
export class OurClientService {
  constructor(
    @InjectRepository(OurClient)
    private readonly clientRepository: Repository<OurClient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateClientsDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const client = new OurClient();

    client.name = data.name;
    client.slug = generateSlug(data.name);
    client.designation = data.designation;
    client.linkedin = data.linkedin;
    client.createdBy = user;

    if (data.image) client.image = data.image;

    return this.clientRepository.save(client);
  }

  findAllAndCount(options: FindManyOptions<OurClient>) {
    return this.clientRepository.findAndCount(options);
  }

  findAll(options: FindManyOptions<OurClient>) {
    return this.clientRepository.find(options);
  }

  findOne(idOrSlug: number | string) {
    return this.clientRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  async update(id: number, data: UpdateClientsDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const client = await this.clientRepository.findOne({ id });
    if (!client) throw new BadRequestException('client not found');

    if (data.name) {
      client.name = data.name;
      client.slug = generateSlug(data.name);
    }
    if (data.designation) client.designation = data.designation;
    if (data.linkedin) client.linkedin = data.linkedin;
    if (data.image) {
      // Removing old image from file system
      if (client.image) removeFile(client.image);
      client.image = data.image === '{{DELETE}}' ? null : data.image;
    }
    if (Object.keys(data).includes('isActive')) {
      client.isActive = data.isActive === 'true' ? true : false;
    }

    return this.clientRepository.save(client);
  }

  async remove(id: number) {
    const client = await this.clientRepository.findOne({ id });
    if (!client) throw new BadRequestException('client not found');

    await this.clientRepository.remove(client);

    // Removing old image from file system
    if (client.image) removeFile(client.image);
  }
}
