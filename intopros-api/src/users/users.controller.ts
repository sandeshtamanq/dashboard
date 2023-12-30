import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { getManager } from 'typeorm';

import { UpdateUserDetailDto } from './dto/userDetail.dto';
import { UpdateUserByAdminDto } from './dto/userDetailAdmin.dto';
import { UpdateUserDto } from './dto/user.dto';

import { JwtAuthGuard } from '../@guards/jwt-auth.guard';
import { RolesGuard } from '../@guards/roles.guard';
import { Roles } from '../@decorators/role.decorator';

import { UserDetailService } from './usersDetail.service';
import { UsersLogService } from './usersLog.service';
import { UsersService } from './users.service';
import { SmtpService } from '../smtp.service';

import { UserLogActionType } from './entities/userLog.entity';
import { generatePassword } from '../@utils/utils';
import { UserRole } from './entities/user.entity';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly smtpService: SmtpService,
    private readonly userService: UsersService,
    private readonly userDetailService: UserDetailService,
    private readonly userLogService: UsersLogService,
  ) {}

  @ApiQuery({ name: 'skip', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  @ApiQuery({ name: 'roles', enum: UserRole, isArray: true, required: false })
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Get('list')
  async getUserList(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('roles') roles?: any,
  ) {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;

    // Find users matching the filters
    let usersQuery = this.userDetailService.userDetailRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.user', 'actualUser')
      .where('user.id');

    const isValidNumber = (num: any) => {
      return isNaN(num) ? false : true;
    };

    // Filter by roles
    if (roles) {
      usersQuery.andWhere('actualUser.role IN (:...roles)', {
        roles: Array.isArray(roles) ? roles : [roles].map((r: any) => `${r}`),
      });
    }

    usersQuery.skip(skipValue).take(takeValue);

    const [_users, count] = await usersQuery
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    const users = _users.map((usr) => {
      delete usr.user.password;
      return usr;
    });

    return {
      message: "Successfully fetched user's list",
      data: users,
      pagination: {
        total: count,
        perPage: takeValue,
        from: skipValue + 1,
        to: skipValue + takeValue,
      },
    };
  }

  @Post('list')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  async createUser(@Body() data: UpdateUserByAdminDto, @Request() req: any) {
    const { email, username, password, role, ...userDetails } = data;

    await getManager().transaction(async (transactionalEntityManager) => {
      const user = await this.userService.createUser(
        {
          email,
          username,
          password,
          role,
          ...(req.user.id ? { creatorId: req.user.id } : {}),
        },
        transactionalEntityManager,
      );

      await this.userDetailService.updateUserDetails(
        user.id,
        userDetails,
        transactionalEntityManager,
      );

      // Adding user log about who created the user account for audit purposes
      await this.userLogService.addUserLog(
        user.id,
        req.user.id,
        UserLogActionType.CREATE,
        transactionalEntityManager,
      );
    });

    // Sending mail with password and username
    this.smtpService.sendAdminSignupMail(email, username, password);

    return {
      message: 'Successfully created User account!',
    };
  }

  @Get('list/:id')
  async getUser(@Param('id') id: number) {
    const userData = await this.userService.getUser({
      where: { id },
      relations: ['details'],
    });

    delete userData.password;

    return {
      message: 'Successfully fetched user',
      data: userData,
    };
  }

  @Patch('list/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  async updateUser(
    @Request() req: any,
    @Param('id') id: number,
    @Body() data: UpdateUserByAdminDto,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid user ID!');

    const { role, ...userDetails } = data;

    await getManager().transaction(async (transactionalEntityManager) => {
      await this.userService.updateUser(id, { role });
      await this.userDetailService.updateUserDetails(
        id,
        userDetails,
        transactionalEntityManager,
      );

      // Adding user log about who updated the user account for audit purposes
      await this.userLogService.addUserLog(
        id,
        req.user.id,
        UserLogActionType.UPDATE,
        transactionalEntityManager,
      );
    });

    const userDetailsNew = await this.userDetailService.getUserDetailsMinimal(
      id,
    );

    return {
      message: 'Successfully updated User details!',
      data: userDetailsNew,
    };
  }

  @Delete('list/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  async deleteUser(@Param('id') id: number, @Request() req: any) {
    if (isNaN(id)) throw new BadRequestException('Invalid user ID!');
    if (req.user?.id === id)
      throw new BadRequestException('You cannot delete your own account!');

    const userId = await this.userService.deleteUserByDetailId(id);

    // Adding user log about who deleted the user account for audit purposes
    await this.userLogService.addUserLog(
      userId,
      req.user.id,
      UserLogActionType.DELETE,
    );

    return { message: 'Successfully deleted User!' };
  }

  @Get('me')
  async getSelf(@Request() req: any) {
    const user = await this.userService.getUser({
      where: { email: req.user.email },
    });
    if (!user) throw new NotFoundException("User doesn't exist");

    const userInfo = user;
    delete userInfo.password;

    return {
      message: 'Successfully fetched user',
      data: userInfo,
    };
  }

  @Patch('me')
  async updateSelf(@Request() req: any, @Body() data: UpdateUserDto) {
    const { password, currentPassword } = data;

    const details = await this.userService.updateUser(req.user.email, {
      password,
      currentPassword,
    });
    delete details.password;

    return {
      message: 'Successfully updated user',
      data: details,
    };
  }

  @Get('my-details')
  async getMyDetails(@Request() req: any) {
    const userDetail = await this.userDetailService.getUserDetails(req.user.id);
    if (!userDetail) throw new NotFoundException('User details do-not exist!');

    const details = userDetail;
    delete details.user;

    return {
      message: 'Successfully fetched user details',
      data: details,
    };
  }

  @Patch('my-details')
  async updateMyDetails(
    @Request() req: any,
    @Body() data: UpdateUserDetailDto,
  ) {
    const details = await this.userDetailService.updateUserDetails(
      req.user.id,
      data,
    );
    delete details.user;

    return {
      message: 'Successfully updated user details',
      data: details,
    };
  }
}
