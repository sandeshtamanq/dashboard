import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';

import { JwtAuthGuard } from '../@guards/jwt-auth.guard';
import { RolesGuard } from '../@guards/roles.guard';

import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../@decorators/role.decorator';

@ApiBearerAuth()
@ApiTags('Dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPPORT)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/data')
  async getDashboardData() {
    const data = await this.dashboardService.getDashboardData();

    return {
      message: 'Successfully fetched dashboard data!',
      data,
    };
  }
}
