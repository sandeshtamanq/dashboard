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

import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

import { Blog } from './entities/blog.entity';
import { UserRole } from '../users/entities/user.entity';

import { RolesGuard } from '../@guards/roles.guard';
import { JwtAuthGuard } from '../@guards/jwt-auth.guard';

import { Roles } from '../@decorators/role.decorator';
import { Public } from '../@decorators/public.decorator';
import { ApiPaginatedResponse } from '../@decorators/apiPaginatedResponse.decorator';

import { DeleteDto, PaginatedDto } from '../@utils/types';
import { imageUploadFilter, multerDiskStorage } from '../@utils/fileValidator';
import { BlogCategory } from './entities/blogCategory.entity';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dto/blogCategory.dto';

@ApiTags('Blogs')
@Controller('blogs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: Blog })
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
    @Body() blogData: CreateBlogDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const data = await this.blogService.create(
      {
        ...blogData,
        ...(image ? { image: `/${image.path}` } : {}),
      },
      req.user.id,
    );

    return {
      message: 'Successfully created blog',
      data,
    };
  }

  @Public()
  @Get()
  @ApiPaginatedResponse(Blog)
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
  ): Promise<PaginatedDto<Blog>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = filterBy ?? 'active';

    const [data, count] = await this.blogService.findAllAndCount({
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
      message: 'Successfully fetched Blogs!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get('category')
  @ApiPaginatedResponse(BlogCategory)
  async findAllCategory(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filterBy') filterBy?: string,
  ): Promise<PaginatedDto<BlogCategory>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;
    const filterByValue = filterBy ?? 'active';

    const [data, count] = await this.blogService.findAllCategoryAndCount({
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
      message: 'Successfully fetched Blog Categories!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: Blog })
  async findOne(@Param('id') id: string) {
    const blogItem = await this.blogService.findOne(id);
    if (!blogItem) throw new NotFoundException("Blog doesn't exist!");

    return {
      message: 'Successfully fetched blog!',
      data: blogItem,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: Blog })
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
    @Body() blogData: UpdateBlogDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.blogService.update(id, {
      ...blogData,
      ...(image ? { image: `/${image.path}` } : {}),
    });

    return {
      message: "Successfully updated blog's data!",
      data,
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.blogService.remove(id);

    return { message: 'Blog successfully deleted!' };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BlogCategory })
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post('category')
  async createCategory(
    @Request() req: any,
    @Body() blogData: CreateBlogCategoryDto,
  ) {
    const data = await this.blogService.createCategory(
      {
        ...blogData,
      },
      req.user.id,
    );

    return {
      message: 'Successfully created blog category',
      data,
    };
  }


  @Public()
  @Get('category/:id')
  @ApiOkResponse({ type: BlogCategory })
  async findOneCategory(@Param('id') id: string) {
    const blogItem = await this.blogService.findOneCategory(id);
    if (!blogItem) throw new NotFoundException("Category doesn't exist!");

    return {
      message: 'Successfully fetched blog category!',
      data: blogItem,
    };
  }

  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch('category/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() blogData: UpdateBlogCategoryDto,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.blogService.updateCategory(id, {
      ...blogData,
    });

    return {
      message: "Successfully updated blog's category!",
      data,
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete('category/:id')
  async removeCategory(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.blogService.removeCategory(id);

    return { message: 'Blog Category successfully deleted!' };
  }
}
