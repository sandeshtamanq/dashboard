import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import User from '../users/entities/user.entity';

import { generateSlug, removeFile } from '../@utils/utils';
import { OurTeam } from './entities/our-team.entity';
import { CreateTeamDto, UpdateTeamDto } from './dto/our-team.dto';


@Injectable()
export class OurTeamService {
  constructor(
    @InjectRepository(OurTeam)
    private readonly teamsRepository: Repository<OurTeam>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateTeamDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('This is impossible to trigger');

    const teams = new OurTeam();

    teams.name = data.name;
    teams.slug = generateSlug(data.name);
    teams.designation = data.designation;
    teams.linkedin = data.linkedin;
    teams.createdBy = user;

    if (data.image) teams.image = data.image;

    return this.teamsRepository.save(teams);
  }

  findAllAndCount(options: FindManyOptions<OurTeam>) {
    return this.teamsRepository.findAndCount(options);
  }

  findAll(options: FindManyOptions<OurTeam>) {
    return this.teamsRepository.find(options);
  }

  findOne(idOrSlug: number | string) {
    return this.teamsRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  async update(id: number, data: UpdateTeamDto) {
    if (Object.keys(data).length < 1)
      throw new BadRequestException('No data to update');

    const teams = await this.teamsRepository.findOne({ id });
    if (!teams) throw new BadRequestException('teams not found');

    if (data.name) {
      teams.name = data.name;
      teams.slug = generateSlug(data.name);
    }
    if (data.designation) teams.designation = data.designation;
    if (data.linkedin) teams.linkedin = data.linkedin;
    if (data.image) {
      // Removing old image from file system
      if (teams.image) removeFile(teams.image);
      teams.image = data.image === '{{DELETE}}' ? null : data.image;
    }
    if (Object.keys(data).includes('isActive')) {
      teams.isActive = data.isActive === 'true' ? true : false;
    }

    return this.teamsRepository.save(teams);
  }

  async remove(id: number) {
    const teams = await this.teamsRepository.findOne({ id });
    if (!teams) throw new BadRequestException('teams not found');

    await this.teamsRepository.remove(teams);

    // Removing old image from file system
    if (teams.image) removeFile(teams.image);
  }
}
