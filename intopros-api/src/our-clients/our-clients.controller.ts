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
import { OurClientService } from './our-clients.service';
import { OurClient } from './entities/our-clients.entity';
import { CreateClientsDto, UpdateClientsDto } from './dto/our-clients.dto';

@ApiTags('Our-Client')
@Controller('our-client')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OurClientController {
  constructor(private readonly ourClientService: OurClientService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: OurClient })
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
    @Body() servicesData: CreateClientsDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const data = await this.ourClientService.create(
      {
        ...servicesData,
        ...(image ? { image: `/${image.path}` } : {}),
      },
      req.user.id,
    );

    return {
      message: 'Successfully created client',
      data,
    };
  }

  @Public()
  @Get()
  @ApiPaginatedResponse(OurClient)
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PaginatedDto<OurClient>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;

    const [data, count] = await this.ourClientService.findAllAndCount({
      order: { createdAt: 'DESC' },
      skip: skipValue,
      take: takeValue,
    });

    return {
      message: 'Successfully fetched client data!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: OurClient })
  async findOne(@Param('id') id: string) {
    const teamItem = await this.ourClientService.findOne(id);
    if (!teamItem) throw new NotFoundException("client doesn't exist!");

    return {
      message: 'Successfully fetched client!',
      data: teamItem,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: OurClient })
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
    @Body() teamData: UpdateClientsDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.ourClientService.update(id, {
      ...teamData,
      ...(image ? { image: `/${image.path}` } : {}),
    });

    return {
      message: "Successfully updated client's data!",
      data,
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.ourClientService.remove(id);

    return { message: 'Client successfully deleted!' };
  }
}
