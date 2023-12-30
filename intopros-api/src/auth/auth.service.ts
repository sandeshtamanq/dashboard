import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/user.dto';

import { SmtpService } from '../smtp.service';

import { OtpService } from '../otp/otp.service';
import { OtpType } from '../otp/entities/otp.entity';

import {
  PasswordResetFinalDto,
  PasswordResetInitDto,
} from './dto/passwordReset.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private smtpService: SmtpService,
    private otpService: OtpService,
  ) {}

  /**
   * Validate if a user exists and if the password is correct
   */
  async validateUser(username: string, password: string) {
    const user = await this.usersService.getUser({
      where: [{ email: username }, { username }],
      relations: ['details'],
      withDeleted: true,
    });
    if (!user) throw new UnauthorizedException('User is not registered!');

    if (user.deletedAt)
      throw new UnauthorizedException('User account has been already deleted!');

    // if (!user?.details?.isActive)
    //   throw new UnauthorizedException('Your account is not active');

    const isPassValid = await compare(password, user.password);
    if (!isPassValid) throw new UnauthorizedException('Invalid email/password');

    return user;
  }

  /**
   * Login a user and provide a JWT token
   */
  login(user: any) {
    const payload = {
      email: user.email,
      username: user.username,
      role: user.role,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: { role: user.role },
    };
  }

  /**
   * Register a new user
   */
  async register(details: CreateUserDto) {
    const user = await this.usersService.createUser(details);
    const token = this.login(user);

    // Sending welcome email
    this.smtpService.sendSignupMail(details.email, details.username);

    return token;
  }

  /**
   * Initiate password reset
   */
  async initiatePasswordReset(data: PasswordResetInitDto) {
    const user = await this.usersService.getUser({
      where: [{ email: data.username }, { username: data.username }],
    });
    if (!user) throw new UnauthorizedException('User is not registered!');

    // Generating OTP Token
    const token = await this.otpService.createOrUpdateOtp(
      user.id,
      OtpType.PASSWORD_RESET,
    );

    // Sending password reset email
    this.smtpService.sendPasswordResetMail(user.email, user.username, token);
    return;
  }

  /**
   * Finalize password reset
   */
  async finalizePasswordReset(data: PasswordResetFinalDto) {
    const otp = await this.otpService.findOtp(
      OtpType.PASSWORD_RESET,
      data.token,
    );

    // Updating user password
    await this.usersService.updateUser(otp.user.id, {
      password: data.password,
    });

    await this.otpService.deleteOtp(otp.id);
    return;
  }
}
