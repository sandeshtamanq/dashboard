import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import User from '../users/entities/user.entity';
import Otp, { OtpType } from './entities/otp.entity';

const RESET_PASSWORD_VALID_TIME = 15 * 60 * 1000;
const VERIFY_EMAIL_VALID_TIME = 24 * 60 * 60 * 1000;
const OTP_TIME_DEFAULT = 5 * 60 * 1000;

export const getOtpValidTime = (type: OtpType) => {
  return type === OtpType.PASSWORD_RESET
    ? RESET_PASSWORD_VALID_TIME
    : type === OtpType.VERIFY_EMAIL
    ? VERIFY_EMAIL_VALID_TIME
    : OTP_TIME_DEFAULT;
};

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOtp(type: OtpType, code: string) {
    const otp = await this.otpRepository.findOne({
      where: { type, code },
      relations: ['user'],
    });

    if (!otp) throw new BadRequestException('Invalid OTP code!');

    const validTime = getOtpValidTime(type);

    if (otp.updatedAt.getTime() + validTime < Date.now())
      throw new BadRequestException('OTP code has expired!');

    return otp;
  }

  async createOrUpdateOtp(userId: number, type: OtpType) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found!');

    const otp = await this.otpRepository.findOne({
      where: { type, user },
      relations: ['user'],
    });

    const code = uuidv4();

    if (otp) {
      otp.code = code;
      await this.otpRepository.save(otp);
    } else {
      const newOtp = new Otp();
      newOtp.type = type;
      newOtp.code = code;
      newOtp.user = user;
      await this.otpRepository.save(newOtp);
    }

    return code;
  }

  async validateOtp(userId: number, type: OtpType, code: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found!');

    const otp = await this.otpRepository.findOne({
      where: { type, user, code },
      relations: ['user'],
    });

    if (!otp) throw new BadRequestException('Invalid OTP code!');

    const validTime = getOtpValidTime(type);

    if (otp.updatedAt.getTime() + validTime < Date.now())
      throw new BadRequestException('OTP code has expired!');

    return true;
  }

  async deleteOtp(id: number) {
    return await this.otpRepository.delete(id);
  }
}
