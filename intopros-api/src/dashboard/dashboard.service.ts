import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThan, Repository } from 'typeorm';

import dayjs from 'dayjs';
// Use advanced date format
import adFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(adFormat);

import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

import ApiLog from '../@entities/apiLog.entity';

@Injectable()
export class DashboardService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(ApiLog)
    private readonly apiLogRepository: Repository<ApiLog>,
  ) {}

  async getDashboardData() {
    const [
      newUsersToday,
      newUsersAllTime,
      _topUserSkills,
    ] = await Promise.all([
      // Getting count of new users registered today
      this.userService.countUsers({
        where: {
          createdAt: Between(
            dayjs().startOf('day').format(),
            dayjs().endOf('day').format(),
          ),
          role: UserRole.USER,
        },
      }),
      // Getting counts of all the users registered till date
      this.userService.countUsers({
        where: { role: UserRole.USER },
      }),
      // Getting all the user activity
      this.apiLogRepository.find({
        where: {
          createdAt: MoreThan(
            dayjs().subtract(7, 'days').startOf('day').format(),
          ),
          user: { role: UserRole.USER },
        },
        relations: ['user'],
      })
    ]);
  

    return {
      newUsersToday,
      newUsersAllTime,
    };
  }
}
