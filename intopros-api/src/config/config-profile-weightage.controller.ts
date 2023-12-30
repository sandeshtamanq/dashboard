import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../@decorators/role.decorator';

import { JwtAuthGuard } from '../@guards/jwt-auth.guard';
import { RolesGuard } from '../@guards/roles.guard';

import { ConfigService } from './config.service';
import { UpdateProfileWeightageDto } from './dto/profileWeightage.dto';

@ApiBearerAuth()
@ApiTags('Configuration (Profile Weightage)')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('config/profile-weightage')
export class ProfileWeightageController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getProfileWeightage() {
    const data = await this.configService.getProfileWeightage();

    delete data.createdAt;
    delete data.updatedAt;
    delete data.id;

    return {
      data,
      message: 'Successfully fetched profile weightage!',
    };
  }

  @Roles(UserRole.ADMIN)
  @Patch()
  async updateProfileWeightage(@Body() data: UpdateProfileWeightageDto) {
    const output = await this.configService.updateProfileWeightage(data);

    delete output.createdAt;
    delete output.updatedAt;
    delete output.id;

    return {
      data: output,
      message: 'Successfully updated profile weightage!',
    };
  }
}
