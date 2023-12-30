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
import {
  fileUploadFilter,
  imageUploadFilter,
  multerDiskStorage,
} from '../@utils/fileValidator';
import { CareerService } from './career.service';
import { Career } from './entities/career.entity';
import { CreateCareerDto, UpdateCareerDto } from './dto/career.dto';
import {
  CreateCareerCategoryDto,
  UpdateCareerCategoryDto,
} from './dto/careerCategory.dto';
import { CareerCategory } from './entities/careerCategory.entity';
import { UsersService } from '../users/users.service';
import { ILike, IsNull, Like, Not } from 'typeorm';
import {
  CreateApplicationDto,
  Status,
  UpdateApplicationDto,
} from './dto/careerApplication.dto';
import { SmtpService } from '../smtp.service';

@ApiTags('Careers')
@Controller('careers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CareerController {
  constructor(
    private readonly smtpService: SmtpService,
    private readonly careerService: CareerService,
    private readonly userService: UsersService,
  ) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: Career })
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
    @Body() careerData: CreateCareerDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    console.log(image);
    const data = await this.careerService.create(
      {
        ...careerData,
        ...(image ? { image: `/${image.path}` } : {}),
      },
      req.user.id,
    );

    return {
      message: 'Successfully created career',
      data,
    };
  }

  @Public()
  @Get()
  @ApiPaginatedResponse(Career)
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
  ): Promise<PaginatedDto<Career>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = filterBy ?? 'active';

    const [data, count] = await this.careerService.findAllAndCount({
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
      message: 'Successfully fetched Careers!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get('category')
  @ApiPaginatedResponse(CareerCategory)
  async findAllCategory(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
  ): Promise<PaginatedDto<CareerCategory>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = filterBy ?? 'active';

    const [data, count] = await this.careerService.findAllAndCountCategory({
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

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Get('applications')
  async getAllApplications(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
    @Query('search') search?: string,
  ) {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = filterBy ?? 'all';

    const [result, count] =
      await this.careerService.findManyApplicationsWithCount(
        filterByValue,
        search,
        takeValue,
        skipValue,
      );
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
  @Get(':id')
  @ApiOkResponse({ type: Career })
  async findOne(@Param('id') id: string) {
    const careerItem = await this.careerService.findOne(id);
    if (!careerItem) throw new NotFoundException("Career doesn't exist!");

    return {
      message: 'Successfully fetched career!',
      data: careerItem,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: Career })
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
    @Body() careerData: UpdateCareerDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.careerService.update(id, {
      ...careerData,
      ...(image ? { image: `/${image.path}` } : {}),
    });

    return {
      message: "Successfully updated career's data!",
      data,
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.careerService.remove(id);

    return { message: 'Career successfully deleted!' };
  }

  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post('category')
  async createCategory(
    @Request() req: any,
    @Body() Data: CreateCareerCategoryDto,
  ) {
    const data = await this.careerService.createCategory(Data, req.user.id);

    return {
      message: 'Successfully created career category',
      data,
    };
  }

  @Public()
  @Get('category/:id')
  @ApiOkResponse({ type: CareerCategory })
  async findOneCategory(@Param('id') id: string) {
    const careerItem = await this.careerService.findOneCategory(id);
    if (!careerItem) throw new NotFoundException("Category doesn't exist!");

    return {
      message: 'Successfully fetched category!',
      data: careerItem,
    };
  }

  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch('category/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() Data: UpdateCareerCategoryDto,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.careerService.updateCategory(id, {
      ...Data,
    });

    return {
      message: 'Successfully updated career category!',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete('category/:id')
  async removeCategory(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.careerService.removeCategory(id);

    return { message: 'Category successfully deleted!' };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete('applications/:id')
  async removeApplication(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.careerService.removeApplication(id);

    return { message: 'Application successfully deleted!' };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Get('applications/:id')
  async getSingleApplication(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid id');

    const result = await this.careerService.findSingleApplication(id);

    return {
      data: result,
      message: 'Successfully fetched application details!',
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch('applications/:id')
  async resolveApplications(
    @Param('id') id: number,
    @Request() req: any,
    @Body() data: UpdateApplicationDto,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid id');
    const user = await this.userService.getUser({ where: { id: req.user.id } });
    if (!user)
      throw new BadRequestException(
        'You are not allowed to make this request!',
      );

    const result = await this.careerService.resolveApplications(
      id,
      user,
      data.status,
      data.remark,
    );

    return {
      data: result,
      message: "You've successfully resolved this contact us request!",
    };
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Public()
  @Post('applications')
  async createapplications(
    @Body() data: CreateApplicationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.careerService.createApplications({
      ...data,
      ...(file ? { file: `/${file.path}` } : {}),
    });

    return {
      data: result,
      message: 'Your response has been successfully recorded.',
    };
  }

  @Roles(UserRole.ADMIN)
  @Post('applications/email/:id')
  async sendEmail(
    @Param('id') id: number,
    @Request() req: any,
    @Body('emailBody') emailBody: any,
  ) {
    const response = await this.smtpService.sendEmail(emailBody);
    if (response) {
      const user = await this.userService.getUser({
        where: { id: req.user.id },
      });
      if (!user)
        throw new BadRequestException(
          'You are not allowed to make this request!',
        );

      const result = await this.careerService.resolveApplications(
        id,
        user,
        Status.EMAILED,
      );

      return {
        data: result,
        message: `Mail sent successfully to ${emailBody.to}`,
      };
    }
  }
}
