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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserRole } from '../users/entities/user.entity';

import { RolesGuard } from '../@guards/roles.guard';
import { JwtAuthGuard } from '../@guards/jwt-auth.guard';

import { Roles } from '../@decorators/role.decorator';
import { Public } from '../@decorators/public.decorator';
import { ApiPaginatedResponse } from '../@decorators/apiPaginatedResponse.decorator';

import { DeleteDto, PaginatedDto } from '../@utils/types';
import { imageUploadFilter, multerDiskStorage } from '../@utils/fileValidator';
import { OurTeam } from './entities/our-team.entity';
import { OurTeamService } from './our-team.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/our-team.dto';

@ApiTags('Our-team')
@Controller('our-team')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OurTeamController {
  constructor(private readonly ourTeamService: OurTeamService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: OurTeam })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post()
  async create(
    @Request() req: any,
    @Body() servicesData: CreateTeamDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const data = await this.ourTeamService.create(
      {
        ...servicesData,
        ...(image ? { image: `/${image.path}` } : {}),
      },
      req.user.id,
    );

    return {
      message: 'Successfully created team',
      data,
    };
  }

  @Public()
  @Get()
  @ApiPaginatedResponse(OurTeam)
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PaginatedDto<OurTeam>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;

    const [data, count] = await this.ourTeamService.findAllAndCount({
      order: { designation: 'ASC' },
      skip: skipValue,
      take: takeValue,
    });

    return {
      message: 'Successfully fetched team data!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: OurTeam })
  async findOne(@Param('id') id: string) {
    const teamItem = await this.ourTeamService.findOne(id);
    if (!teamItem) throw new NotFoundException("team doesn't exist!");

    return {
      message: 'Successfully fetched team!',
      data: teamItem,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: OurTeam })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() teamData: UpdateTeamDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.ourTeamService.update(id, {
      ...teamData,
      ...(image ? { image: `/${image.path}` } : {}),
    });

    return {
      message: "Successfully updated team's data!",
      data,
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.ourTeamService.remove(id);

    return { message: 'Team successfully deleted!' };
  }
}
