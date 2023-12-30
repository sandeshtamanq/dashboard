import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

//
import ProfileWeightage from './entities/profileWeightage.entity';


import { UpdateProfileWeightageDto } from './dto/profileWeightage.dto';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(ProfileWeightage)
    private readonly profileWeightageRepository: Repository<ProfileWeightage>,
  ) {}

  /* ------------------------------------------------------------------------------------------ */
  /* ------------------------------------ PROFILE WEIGHTAGE ----------------------------------- */
  /* ------------------------------------------------------------------------------------------ */
  async getProfileWeightage() {
    const weightageData = await this.profileWeightageRepository.findOne();
    if (weightageData) return weightageData;

    const newData = new ProfileWeightage();
    return this.profileWeightageRepository.save(newData);
  }

  async updateProfileWeightage(data: UpdateProfileWeightageDto) {
    const result = await this.getProfileWeightage();

    // get sum from object.values
    const sum = Object.values(data).reduce((a, b) => a + b, 0);
    if (sum > 100)
      throw new BadRequestException('Total weightage cannot be more than 100%');

    ProfileWeightage.merge(result, data);
    return await this.profileWeightageRepository.save(result);
  }
}
