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
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TestimonialsService } from './testimonials.service';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
} from './dto/testimonial.dto';

import { UserRole } from '../users/entities/user.entity';

import { RolesGuard } from '../@guards/roles.guard';
import { JwtAuthGuard } from '../@guards/jwt-auth.guard';

import { Roles } from '../@decorators/role.decorator';
import { Public } from '../@decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadFilter, multerDiskStorage } from '../@utils/fileValidator';
import { Testimonial } from './entities/testimonial.entity';

@ApiTags('Testimonials')
@Controller('testimonials')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Post()
  async create(
    @Request() req: any,
    @Body() createTestimonialDto: CreateTestimonialDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const data = await this.testimonialsService.create(
      {
        ...createTestimonialDto,
        ...(image ? { image: `/${image.path}` } : {}),
      },
      req.user.id,
    );

    return {
      message: 'Successfully created testimonial',
      data,
    };
  }

  @Public()
  @Get()
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
  ) {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = filterBy ?? 'active';

    const [data, count] = await this.testimonialsService.findAndCountAll({
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
      message: 'Testimonials successfully fetched!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.testimonialsService.findOne(id);

    return {
      message: 'Testimonial successfully fetched!',
      data,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: Testimonial })
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
    @Body() updateTestimonialDto: UpdateTestimonialDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.testimonialsService.update(id, {
      ...updateTestimonialDto,
      ...(image ? { image: `/${image.path}` } : {}),
    });

    return {
      message: 'Testimonial successfully updated!',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.testimonialsService.remove(id);

    return { message: 'Testimonial successfully deleted!' };
  }
}
