import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserDetailService } from './usersDetail.service';
import UserLog, { UserLogActionType } from './entities/userLog.entity';
import UserDetail from './entities/userDetail.entity';
import User from './entities/user.entity';

@Injectable()
export class UsersLogService {
  constructor(
    @InjectRepository(UserLog)
    private userLogRepository: Repository<UserLog>,
    private userService: UsersService,
    private userDetailService: UserDetailService,
  ) {}

  async addUserLog(
    userId: number,
    adminId: number,
    action: UserLogActionType,
    manager?: EntityManager,
  ) {
    let userDetails: UserDetail;
    if (manager) {
      userDetails = await manager.findOne(UserDetail, {
        where: { user: { id: userId } },
        relations: ['user', 'logs'],
      });
    } else {
      userDetails = await this.userDetailService.getSingleUserDetails({
        where: { user: { id: userId } },
        relations: ['user', 'logs'],
        withDeleted: true,
      });
    }
    if (!userDetails) throw new NotFoundException('User not found');

    let adminUser: User;
    if (manager) {
      adminUser = await manager.findOne(User, { where: { id: adminId } });
    } else {
      adminUser = await this.userService.getUser({
        where: { id: adminId },
      });
    }
    if (!adminUser) throw new NotFoundException('Admin not found!');

    const userLog = new UserLog();
    userLog.action = action;
    userLog.performer = adminUser;
    userLog.userDetail = userDetails;

    if (manager) {
      return manager.save(userLog);
    } else {
      return this.userLogRepository.save(userLog);
    }
  }
}
