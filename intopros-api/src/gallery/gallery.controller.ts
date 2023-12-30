import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/gallery.dto';

import { RolesGuard } from '../@guards/roles.guard';
import { JwtAuthGuard } from '../@guards/jwt-auth.guard';

import { Roles } from '../@decorators/role.decorator';
import { Public } from '../@decorators/public.decorator';

import { UserRole } from '../users/entities/user.entity';

@ApiTags('Gallery')
@Controller('gallery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post()
  async create(@Body() data: CreateGalleryDto) {
    const result = await this.galleryService.create(data);

    return {
      data: result,
      message: 'Successfully created new gallery!',
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Get()
  async findAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;

    const [data, count] = await this.galleryService.findManyAndCount({
      order: { createdAt: 'DESC' },
      skip: skipValue,
      take: takeValue,
    });

    return {
      message: 'Successfully fetched gallery items.',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.galleryService.findOne(id);

    return {
      data: result,
      message: 'Successfully fetched gallery item.',
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: CreateGalleryDto) {
    const result = await this.galleryService.update(id, data);

    return {
      data: result,
      message: 'Successfully updated gallery',
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.galleryService.remove(id);

    return { message: 'Successfully removed gallery' };
  }
}
