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
import { Training } from './entities/trainings.entity';
import { CreateTrainingDto, UpdateTrainingDto } from './dto/trainings.dto';
import { imageUploadFilter, multerDiskStorage } from '../@utils/fileValidator';
import { TrainingsService } from './trainings.service';
import { CreateTrainingCategoryDto, UpdateTrainingCategoryDto } from './dto/trainingsCategory.dto';
import { TrainingCategory } from './entities/trainingsCategory.entity';
import { CreateTrainingApplicationDto } from './dto/trainingApplication.dto';
import { UsersService } from '../users/users.service';
import { IsNull, Not } from 'typeorm';

@ApiTags('trainings')
@Controller('trainings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingsController {
  constructor(private readonly trainingService: TrainingsService,
    private readonly userService: UsersService) { }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: Training })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post()
  create(
    @Request() req: any,
    @Body() trainingData: CreateTrainingDto,
    @UploadedFile() File?: Express.Multer.File,
  ) {
    return this.trainingService.create(
      {
        ...trainingData,
        ...(File ? { image: `/${File.path}` } : {}),
      },
      req.user.id,
    );
  }

  
  @Public()
  @Get()
  @ApiPaginatedResponse(Training)
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
  ): Promise<PaginatedDto<Training>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = filterBy ?? 'active';

    const [data, count] = await this.trainingService.findAllAndCount({
      where: {
        ...(filterByValue === 'all'
          ? {}
          : filterByValue === 'inactive'
          ? { isActive: false }
          : { isActive: true }),
      },
      order: { createdAt: 'DESC' },
      skip: skipValue,
      take: takeValue,
    });

    return {
      message: 'Successfully fetched Trainings!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Get('application')
  async getAllApplications(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
  ) {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = filterBy ?? 'all';

    const [result, count] =
      await this.trainingService.findManyApplicationsWithCount({
        where: {
          ...(filterByValue === 'resolved'
            ? { resolvedAt: Not(IsNull()) }
            : filterByValue === 'notResolved'
              ? { resolvedAt: IsNull() }
              : {}),
        },
        order: { createdAt: 'DESC' },
        skip: skipValue,
        take: takeValue,
        relations: ['resolvedBy'],
      });

    return {
      data: result,
      message: 'Successfully fetched applications!',
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get('category')
  @ApiPaginatedResponse(TrainingCategory)
  async findAllCategory(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
  ): Promise<PaginatedDto<TrainingCategory>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = filterBy ?? 'active';

    const [data, count] = await this.trainingService.findAllAndCountCategory({
      where: {
        ...(filterByValue === 'all'
          ? {}
          : filterByValue === 'inactive'
            ? { isActive: false }
            : { isActive: true }),
      },
      order: { createdAt: 'DESC' },
      skip: skipValue,
      take: takeValue,
    });

    return {
      message: 'Successfully fetched Category!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
    @Get(':id')
    @ApiOkResponse({ type: Training })
    async findOne(@Param('id') id: string) {
      const trainingItem = await this.trainingService.findOne(id);
      if (!trainingItem) throw new NotFoundException("Training doesn't exist!");
  
      return {
        message: 'Successfully fetched training!',
        data: trainingItem,
      };
    }

  @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOkResponse({ type: Training })
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
      @Body() trainingData: UpdateTrainingDto,
      @UploadedFile() image?: Express.Multer.File,
    ) {
      if (isNaN(id)) throw new BadRequestException('Invalid ID!');
  
      const data = await this.trainingService.update(id, {
        ...trainingData,
        ...(image ? { image: `/${image.path}` } : {}),
      });
  
      return {
        message: "Successfully updated training's data!",
        data,
      };
    }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.trainingService.remove(id);

    return { message: 'training successfully deleted!' };
  }

  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post('category')
  async createCategory(
    @Request() req: any,
    @Body() Data: CreateTrainingCategoryDto
  ) {
    const data = await this.trainingService.createCategory(
      Data,
      req.user.id,
    );

    return {
      message: 'Successfully created training category',
      data,
    };
  }


  @Public()
  @Get('category/:id')
  @ApiOkResponse({ type: TrainingCategory })
  async findOneCategory(@Param('id') id: string) {
    const trainingItem = await this.trainingService.findOneCategory(id);
    if (!trainingItem) throw new NotFoundException("Category doesn't exist!");

    return {
      message: 'Successfully fetched category!',
      data: trainingItem,
    };
  }

  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch('category/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() Data: UpdateTrainingCategoryDto,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.trainingService.updateCategory(id, {
      ...Data,
    });

    return {
      message: "Successfully updated training category!",
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete('category/:id')
  async removeCategory(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.trainingService.removeCategory(id);

    return { message: 'Category successfully deleted!' };
  }

  @Public()
  @Post('application')
  async createapplications(
    @Body() data: CreateTrainingApplicationDto) {
    const result = await this.trainingService.createApplications(
      {
        ...data,
      });

    return {
      data: result,
      message: 'Your response has been successfully recorded.',
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch('application/:id')
  async resolveApplications(@Param('id') id: number, @Request() req: any) {
    if (isNaN(id)) throw new BadRequestException('Invalid id');

    const user = await this.userService.getUser({ where: { id: req.user.id } });
    if (!user)
      throw new BadRequestException(
        'You are not allowed to make this request!',
      );

    const result = await this.trainingService.resolveApplications(id, user);

    return {
      data: result,
      message: "You've successfully resolved this training application request!",
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Get('application/:id')
  async getSingleApplication(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid id');

    const result = await this.trainingService.findSingleApplication(id);

    return {
      data: result,
      message: 'Successfully fetched application details!',
    };
  }
}
