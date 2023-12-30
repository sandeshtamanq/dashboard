import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

import { UserRole } from '../users/entities/user.entity';

import { RolesGuard } from '../@guards/roles.guard';
import { JwtAuthGuard } from '../@guards/jwt-auth.guard';

import { Roles } from '../@decorators/role.decorator';
import { Public } from '../@decorators/public.decorator';
import { ApiPaginatedResponse } from '../@decorators/apiPaginatedResponse.decorator';

import { DeleteDto, PaginatedDto } from '../@utils/types';
import { imageUploadFilter, multerDiskStorage } from '../@utils/fileValidator';
import { WorksService } from './works.service';
import { Works } from './entities/works.entity';
import { CreateWorksDto, UpdateWorksDto } from './dto/works.dto';
import { filter } from 'rxjs';

@ApiTags('Works')
@Controller('works')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: Works })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'logo',
          maxCount: 1,
        },
        {
          name: 'banner',
          maxCount: 1,
        },
      ],
      {
        fileFilter: imageUploadFilter,
        storage: multerDiskStorage,
      },
    ),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post()
  async create(
    @Request() req: any,
    @Body() worksData: CreateWorksDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    const data = await this.worksService.create(
      {
        ...worksData,
        ...(files.logo ? { logo: `/${files.logo.map((e) => e.path)}` } : {}),
        ...(files.banner
          ? { banner: `/${files.banner.map((e) => e.path)}` }
          : {}),
      },
      req.user.id,
    );

    return {
      message: 'Successfully created works',
      data,
    };
  }

  @Public()
  @Get()
  @ApiPaginatedResponse(Works)
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
    @Query('status') status?: string,
  ): Promise<PaginatedDto<Works>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = status ?? 'show';
    const filterByStatus = filterBy ?? 'active';

    const [data, count] = await this.worksService.findAllAndCount({
      where: {
        ...(filterByValue === 'all'
          ? {}
          : filterByValue === 'hide'
          ? { show: false }
          : { show: true }),
        ...(filterByStatus === 'all'
          ? {}
          : filterByStatus === 'inactive'
          ? { isActive: false }
          : { isActive: true }),
      },
      order: { createdAt: 'DESC' },
      skip: skipValue,
      take: takeValue,
    });

    return {
      message: 'Successfully fetched works!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: Works })
  async findOne(@Param('id') id: string) {
    const worksItem = await this.worksService.findOne(id);
    if (!worksItem) throw new NotFoundException("work doesn't exist!");

    return {
      message: 'Successfully fetched work!',
      data: worksItem,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: Works })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'logo',
          maxCount: 1,
        },
        {
          name: 'banner',
          maxCount: 1,
        },
      ],
      {
        fileFilter: imageUploadFilter,
        storage: multerDiskStorage,
      },
    ),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() worksData: UpdateWorksDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.worksService.update(id, {
      ...worksData,
      ...(files.logo ? { logo: `/${files.logo.map((e) => e.path)}` } : {}),
      ...(files.banner
        ? { banner: `/${files.banner.map((e) => e.path)}` }
        : {}),
    });

    return {
      message: "Successfully updated works's data!",
      data,
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.worksService.remove(id);

    return { message: 'work successfully deleted!' };
  }
}
