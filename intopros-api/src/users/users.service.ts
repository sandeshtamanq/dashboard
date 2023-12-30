import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare, hashSync } from 'bcrypt';

import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import UserDetail from './entities/userDetail.entity';
import User, { UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserDetail)
    public userDetailsRepository: Repository<UserDetail>,
  ) {}

  /**
   * Count users based on filter condition
   */
  countUsers(options: FindManyOptions<User>) {
    return this.usersRepository.count(options);
  }

  /**
   * Fetch multiple users from the DB filtered by the condition
   */
  getAllUsers(options: FindManyOptions<User>) {
    return this.usersRepository.find(options);
  }

  /**
   * Fetch single user from the DB matching the condition
   */
  getUser(options: FindOneOptions<User>) {
    return this.usersRepository.findOne(options);
  }

  /**
   * Soft-delete a user from the DB matching the condition
   */
  async deleteUser(userId: number) {
    const user = await this.getUser({ where: { id: userId } });
    if (!user) throw new NotFoundException("User doesn't exists");

    return this.usersRepository.softDelete(user.id);
  }

  async deleteUserByDetailId(detailId: number) {
    const user = await this.getUser({
      where: { details: { id: detailId } },
      relations: ['details'],
    });
    if (!user) throw new NotFoundException("User doesn't exists");

    await this.usersRepository.softDelete(user.id);
    return user.id;
  }

  /**
   * Create a new user (register new user)
   */
  async createUser(
    data: CreateUserDto & { role?: UserRole; creatorId?: number },
    manager?: EntityManager,
  ) {
    // Checking if user with that mail is already registered
    const user = await this.usersRepository.findOne({
      where: [{ email: data.email }, { username: data.username }],
      withDeleted: true,
    });
    // Checking if the user account had been previously created and deleted
    if (user?.deletedAt) {
      throw new BadRequestException(
        'Your account has been previously deleted!',
      );
    }
    // Checking if user with same email exists
    if (user?.email === data.email) {
      throw new BadRequestException('Email already exists');
    }
    // Checking if user with same username exists
    if (user?.username === data.username) {
      throw new BadRequestException('Username already exists');
    }

    // Creating empty userDetail entry for the new user
    const userDetails = new UserDetail();

    let savedUserDetails: UserDetail;

    if (manager) {
      savedUserDetails = await manager.save(userDetails);
    } else {
      savedUserDetails = await this.userDetailsRepository.save(userDetails);
    }

    // Creating new user
    const newUser = new User();
    newUser.email = data.email;
    newUser.username = data.username;
    newUser.password = hashSync(data.password, 3);
    newUser.role = data.role ?? UserRole.USER;
    newUser.details = savedUserDetails;

    if (data.creatorId) newUser.creatorId = data.creatorId;

    if (manager) {
      return manager.save(newUser);
    } else {
      return this.usersRepository.save(newUser);
    }
  }

  async updateUser(
    id: number | string,
    data: UpdateUserDto & { role?: UserRole },
    manager?: EntityManager,
  ) {
    // TODO:: Handle username and email duplication

    const user = await this.usersRepository.findOne({
      where: [{ id: id }, { email: id }],
    });
    if (!user) throw new NotFoundException("User doesn't exists");

    // TODO:: Handle username, email update
    if (data.role) user.role = data.role;

    // Password update
    if (data.password) {
      if (!data.currentPassword)
        throw new BadRequestException('Current password is required!');

      const isPassMatching = await compare(data.currentPassword, user.password);
      if (!isPassMatching)
        throw new BadRequestException("Current password doesn't match");

      user.password = hashSync(data.password, 3);
    }

    if (manager) {
      return manager.save(user);
    } else {
      return this.usersRepository.save(user);
    }
  }
}
