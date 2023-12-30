import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  BadRequestException,
  Request,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../@guards/roles.guard';
import { Roles } from '../@decorators/role.decorator';
import { UserRole } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../@guards/jwt-auth.guard';

import { FileInterceptor } from '@nestjs/platform-express';

import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/contact-us.dto';
import { UsersService } from '../users/users.service';
import { Public } from '../@decorators/public.decorator';
import { IsNull, Not } from 'typeorm';
import { fileUploadFilter, multerDiskStorage } from '../@utils/fileValidator';

@ApiTags('Contact US')
@Controller('contact-us')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContactUsController {
  constructor(
    private readonly contactUsService: ContactUsService,
    private readonly userService: UsersService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Get()
  async getAllContactUs(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
  ) {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = filterBy ?? 'all';

    const [result, count] =
      await this.contactUsService.findManyContactUsWithCount({
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
      message: 'Successfully fetched contact us items!',
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Get(':id')
  async getSingleContactUs(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid id');

    const result = await this.contactUsService.findSingleContactus(id);

    return {
      data: result,
      message: 'Successfully fetched contact us details!',
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch(':id')
  async resolveContactUs(@Param('id') id: number, @Request() req: any) {
    if (isNaN(id)) throw new BadRequestException('Invalid id');

    const user = await this.userService.getUser({ where: { id: req.user.id } });
    if (!user)
      throw new BadRequestException(
        'You are not allowed to make this request!',
      );

    const result = await this.contactUsService.resolveContactUs(id, user);

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
  @Post()
  async createContactUs(
    @Body() data: CreateContactUsDto,
    @UploadedFile() file?: Express.Multer.File) {
    const result = await this.contactUsService.createContactUs(
      {
        ...data,
        ...(file ? { file: `/${file.path}` } : {}),
      });

    return {
      data: result,
      message: 'Your response has been successfully recorded.',
    };
  }
}
