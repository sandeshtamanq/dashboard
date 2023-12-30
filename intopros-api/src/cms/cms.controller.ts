import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsNull, Not } from 'typeorm';

import { Roles } from '../@decorators/role.decorator';
import { Public } from '../@decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';

import { RolesGuard } from '../@guards/roles.guard';
import { JwtAuthGuard } from '../@guards/jwt-auth.guard';

import { CmsService } from './cms.service';
import { Cms } from './entities/cms.entity';
import { CreateCmsDto } from './dto/cms.dto';

import { DeleteDto, GenericResponseDto, PaginatedDto } from '../@utils/types';
import {
  ApiGenericResponse,
  ApiPaginatedResponse,
} from '../@decorators/apiPaginatedResponse.decorator';
import { isString } from 'class-validator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('CMS')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Cms })
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post()
  async create(@Request() req: any, @Body() createCmDto: CreateCmsDto) {
    const data = await this.cmsService.create(createCmDto, req.user.id);

    return {
      message: 'Successfully created CMS entry',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Get()
  @ApiPaginatedResponse(Cms)
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
  ): Promise<PaginatedDto<Cms>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = filterBy ?? 'all';

    const [data, count] = await this.cmsService.findAllAndCount({
      where: {
        parentPageId: IsNull(),
        creatorId: Not(IsNull()),
        ...(filterByValue === 'active'
          ? { isActive: true }
          : filterByValue === 'inactive'
          ? { isActive: false }
          : {}),
      },
      order: { createdAt: 'DESC' },
      skip: skipValue,
      take: takeValue,
      relations: ['createdBy'],
    });

    return {
      message: 'Successfully fetched CMS details',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: Cms })
  async findOne(
    @Param('id') id: string | number,
    @Query('filterBy') filterBy?: string,
  ) {
    const filterByValue = filterBy ?? 'active';

    if (isNaN(+id)) {
      const data = await this.cmsService.findOneCMSBySlug(id, filterByValue);

      return {
        message: 'Successfully fetched CMS details',
        data,
      };
    } else {
      const data = await this.cmsService.findOneCMSById(+id, filterByValue);

      return {
        message: 'Successfully fetched CMS details',
        data,
      };
    }
  }

  @ApiGenericResponse(Cms)
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCmDto: CreateCmsDto,
  ): Promise<GenericResponseDto<Cms>> {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.cmsService.update(id, updateCmDto);

    return {
      message: "Successfully updated CMS page's details",
      data,
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<DeleteDto> {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.cmsService.remove(id);

    return {
      message: "Successfully deleted CMS page's details",
    };
  }
}
