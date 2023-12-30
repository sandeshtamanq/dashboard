import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';

import {
  UpdateUserDetailDto,
} from './dto/userDetail.dto';

import UserDetail from './entities/userDetail.entity';

import { ConfigService } from '../config/config.service';
import { removeFile } from '../@utils/utils';
import { UserRole } from './entities/user.entity';

@Injectable()
export class UserDetailService {
  constructor(
    @InjectRepository(UserDetail)
    public readonly userDetailRepository: Repository<UserDetail>,
    //
    private readonly configService: ConfigService,
  ) {}

  countUserDetails(options: FindManyOptions<UserDetail>) {
    return this.userDetailRepository.count(options);
  }

  getManyUserDetails(options: FindManyOptions<UserDetail>) {
    return this.userDetailRepository.find(options);
  }

  getSingleUserDetails(options: FindOneOptions<UserDetail>) {
    return this.userDetailRepository.findOne(options);
  }

  getUserDetailsMinimal(userId: number) {
    return this.userDetailRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  /**
   * Fetch details of single user provided the user's ID
   */
  getUserDetails(userId: number) {
    return this.userDetailRepository.findOne({
      where: { user: { id: userId } },
      relations: [
        'user',
      ],
    });
  }

  async updateUserDetails(
    userId: number,
    data: UpdateUserDetailDto & { profilePicture?: string },
    manager?: EntityManager,
  ) {
    let userDetails: UserDetail;
    if (manager) {
      userDetails = await manager.findOne(UserDetail, {
        where: { user: { id: userId } },
        relations: ['user'],
      });
    } else {
      userDetails = await this.userDetailRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    }
    if (!userDetails)
      throw new NotFoundException('User details do-not exist first!');

    if (!Object.keys(data).length)
      throw new BadRequestException('No data to update!');

    let updateData: UserDetail;
    if (manager) {
      const updatedUserDetails = manager.merge(UserDetail, userDetails, data);
      updateData = await manager.save(updatedUserDetails);
    } else {
      const updatedUserDetails = this.userDetailRepository.merge(
        userDetails,
        data,
      );
      updateData = await this.userDetailRepository.save(updatedUserDetails);
    }

    // Updating profile completion value for the user
    await this.updateProfileCompletion(userDetails.id, manager);

    return updateData;
  }

  private async updateProfileCompletion(
    userId: number,
    manager?: EntityManager,
  ) {
    const relations = [
      'user',
    ];

    let userDetails: UserDetail;
    if (manager) {
      userDetails = await manager.findOne(UserDetail, {
        where: { id: userId },
        relations,
      });
    } else {
      userDetails = await this.userDetailRepository.findOne({
        where: { id: userId },
        relations,
      });
    }
    if (!userDetails) throw new NotFoundException('User details do-not exist!');
    if (userDetails.user.role !== UserRole.USER) return;

    const profileWeightage = await this.configService.getProfileWeightage();
    let completionValue = 0;

    if (userDetails.firstName)
      completionValue += profileWeightage?.basicInfo ?? 0;

    userDetails.profileCompleteness = completionValue;

    if (manager) {
      await manager.save(userDetails);
    } else {
      await this.userDetailRepository.save(userDetails);
    }
  }
}
