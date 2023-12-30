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

import { Technologies } from './entities/technologies.entity';
import {
  CreateTechnologiesDto,
  UpdateTechnologiesDto,
} from './dto/technologies.dto';
import { TechnologiesService } from './technologies.service';
import {
  CreateTechnologiesInfoDto,
  UpdateTechnologiesInfoDto,
} from './dto/technologiesInfo.dto';
import { TechnologiesInfo } from './entities/technologiesInfo.entity';
import { TechnologiesFramework } from './entities/technologiesFramework.entity';
import {
  CreateTechnologiesFrameworkDto,
  UpdateTechnologiesFrameworkDto,
} from './dto/technologiesFramework.dto';
import {
  CreateTechnologiesHiringMenuDto,
  UpdateTechnologiesHiringMenuDto,
} from './dto/technologiesHiringMenu.dto';
import { TechnologiesHiringMenu } from './entities/technologiesHiringMenu.entity';
import {
  CreateTechnologiesFAQDto,
  UpdateTechnologiesFAQDto,
} from './dto/technologiesFAQ.dto';
import { TechnologiesFAQ } from './entities/technologiesFAQ.entity';
import { CreateHiringApplicationDto } from './dto/technologiesHiringApplication.dto';
import HiringApplication from './entities/technologiesHiringApplication.entity';

@ApiTags('technologies')
@Controller('technologies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: Technologies })
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
    @Body() technologiesData: CreateTechnologiesDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const data = await this.technologiesService.create(
      {
        ...technologiesData,
        ...(image ? { image: `/${image.path}` } : {}),
      },
      req.user.id,
    );

    return {
      message: 'Successfully created technology',
      data,
    };
  }

  @Public()
  @Get()
  @ApiPaginatedResponse(Technologies)
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PaginatedDto<Technologies>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;

    const [data, count] = await this.technologiesService.findAllAndCount({
      order: { createdAt: 'DESC' },
      skip: skipValue,
      take: takeValue,
    });

    return {
      message: 'Successfully fetched technology!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.technologiesService.remove(id);

    return { message: 'technology successfully deleted!' };
  }

  @Public()
  @Get('info')
  @ApiPaginatedResponse(TechnologiesInfo)
  async findAllInfo(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PaginatedDto<TechnologiesInfo>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;

    const [data, count] = await this.technologiesService.findAllInfoAndCount({
      order: { createdAt: 'DESC' },
      skip: skipValue,
      take: takeValue,
    });

    return {
      message: 'Successfully fetched technologies Info!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get('faq')
  @ApiPaginatedResponse(TechnologiesFAQ)
  async findAllFAQ(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PaginatedDto<TechnologiesFAQ>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;

    const [data, count] = await this.technologiesService.findAllFAQAndCount({
      relations: ['belongsTo'],
      order: { createdAt: 'DESC' },
      skip: skipValue,
      take: takeValue,
    });

    return {
      message: 'Successfully fetched technologies FAQs!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get('frameworks')
  @ApiPaginatedResponse(TechnologiesFramework)
  async findAllFrameworks(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PaginatedDto<TechnologiesFramework>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;

    const [data, count] =
      await this.technologiesService.findAllFrameworksAndCount({
        relations: ['belongsTo'],
        order: { createdAt: 'DESC' },
        skip: skipValue,
        take: takeValue,
      });

    return {
      message: 'Successfully fetched technologies Frameworks!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get('hiring-menu')
  @ApiPaginatedResponse(TechnologiesHiringMenu)
  async findAllMenu(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PaginatedDto<TechnologiesHiringMenu>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;

    const [data, count] = await this.technologiesService.findAllMenuAndCount({
      order: { createdAt: 'DESC' },
      skip: skipValue,
      take: takeValue,
    });

    return {
      message: 'Successfully fetched hiring menu!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get('application')
  @ApiPaginatedResponse(HiringApplication)
  async findAllHiringApplications(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PaginatedDto<HiringApplication>> {
    const skipValue = isNaN(skip) ? 0 : skip;
    const takeValue = isNaN(take) ? 10 : take;

    const [data, count] =
      await this.technologiesService.findAllApplicationAndCount({
        relations: ['package'],
        order: { createdAt: 'DESC' },
        skip: skipValue,
        take: takeValue,
      });

    return {
      message: 'Successfully fetched hiring Applications!',
      data,
      pagination: {
        total: count,
        perPage: takeValue,
      },
    };
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: Technologies })
  async findOne(@Param('id') id: string) {
    const technologiesItem = await this.technologiesService.findOne(id);
    if (!technologiesItem)
      throw new NotFoundException("technology doesn't exist!");

    return {
      message: 'Successfully fetched technology!',
      data: technologiesItem,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: Technologies })
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
    @Body() technologiesData: UpdateTechnologiesDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.technologiesService.update(id, {
      ...technologiesData,
      ...(image ? { image: `/${image.path}` } : {}),
    });

    return {
      message: "Successfully updated technology's data!",
      data,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: TechnologiesInfo })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post('info')
  async createInfo(
    @Request() req: any,
    @Body() technologiesData: CreateTechnologiesInfoDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const data = await this.technologiesService.createInfo(
      {
        ...technologiesData,
        ...(image ? { image: `/${image.path}` } : {}),
      },
      req.user.id,
    );

    return {
      message: 'Successfully created technology info',
      data,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: TechnologiesFramework })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post('frameworks')
  async createFramework(
    @Request() req: any,
    @Body() technologiesData: CreateTechnologiesFrameworkDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const data = await this.technologiesService.createFramework(
      {
        ...technologiesData,
        ...(image ? { image: `/${image.path}` } : {}),
      },
      req.user.id,
    );

    return {
      message: 'Successfully created technology framework',
      data,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: TechnologiesInfo })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post('faq')
  async createFAQ(
    @Request() req: any,
    @Body() technologiesData: CreateTechnologiesFAQDto,
  ) {
    const data = await this.technologiesService.createFAQ(
      {
        ...technologiesData,
      },
      req.user.id,
    );

    return {
      message: 'Successfully created technology FAQ',
      data,
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
  @Post('application')
  async createHiringApplication(
    @Body() data: CreateHiringApplicationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.technologiesService.createHiringApplication({
      ...data,
      ...(file ? { file: `/${file.path}` } : {}),
    });

    return {
      data: result,
      message: 'Your response has been successfully recorded.',
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: TechnologiesInfo })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post('hiring-menu')
  async createHiringMenu(
    @Request() req: any,
    @Body() technologiesData: CreateTechnologiesHiringMenuDto,
  ) {
    const data = await this.technologiesService.createHiringMenu(
      {
        ...technologiesData,
      },
      req.user.id,
    );

    return {
      message: 'Successfully created hiring menu',
      data,
    };
  }

  @Public()
  @Get('info/:id')
  @ApiOkResponse({ type: TechnologiesInfo })
  async findOneInfo(@Param('id') id: string) {
    const technologiesItem = await this.technologiesService.findOneInfo(id);
    if (!technologiesItem) throw new NotFoundException("Info doesn't exist!");

    return {
      message: 'Successfully fetched Info!',
      data: technologiesItem,
    };
  }

  @Public()
  @Get('faq/:id')
  @ApiOkResponse({ type: TechnologiesFAQ })
  async findOneFAQ(@Param('id') id: string) {
    const technologiesItem = await this.technologiesService.findOneFAQ(id);
    if (!technologiesItem) throw new NotFoundException("FAQ doesn't exist!");

    return {
      message: 'Successfully fetched FAQ!',
      data: technologiesItem,
    };
  }

  @Public()
  @Get('application/:id')
  @ApiOkResponse({ type: HiringApplication })
  async findOneApplication(@Param('id') id: string) {
    const technologiesItem = await this.technologiesService.findOneApplication(
      id,
    );
    if (!technologiesItem)
      throw new NotFoundException("Application doesn't exist!");

    return {
      message: 'Successfully fetched Application!',
      data: technologiesItem,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: TechnologiesInfo })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch('info/:id')
  async updateInfo(
    @Param('id') id: number,
    @Body() technologiesData: UpdateTechnologiesInfoDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.technologiesService.updateInfo(id, {
      ...technologiesData,
      ...(image ? { image: `/${image.path}` } : {}),
    });

    return {
      message: "Successfully updated technology's info!",
      data,
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: TechnologiesInfo })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch('faq/:id')
  async updateFAQ(
    @Param('id') id: number,
    @Body() technologiesData: UpdateTechnologiesFAQDto,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.technologiesService.updateFAQ(id, {
      ...technologiesData,
    });

    return {
      message: "Successfully updated technology's FAQ!",
      data,
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete('faq/:id')
  async removeFAQ(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.technologiesService.removeFAQ(id);

    return { message: 'FAQ successfully deleted!' };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete('application/:id')
  async removeApplication(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.technologiesService.removeApplication(id);

    return { message: 'Application successfully deleted!' };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: TechnologiesFramework })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch('frameworks/:id')
  async updateFramework(
    @Param('id') id: number,
    @Body() technologiesData: UpdateTechnologiesFrameworkDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.technologiesService.updateFramework(id, {
      ...technologiesData,
      ...(image ? { image: `/${image.path}` } : {}),
    });

    return {
      message: "Successfully updated technology's framework!",
      data,
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete('info/:id')
  async removeInfo(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.technologiesService.removeInfo(id);

    return { message: 'Info successfully deleted!' };
  }

  @Public()
  @Get('frameworks/:id')
  @ApiOkResponse({ type: Technologies })
  async findOneFramework(@Param('id') id: string) {
    const technologiesItem = await this.technologiesService.findOneFramework(
      id,
    );
    if (!technologiesItem)
      throw new NotFoundException("Framework doesn't exist!");

    return {
      message: 'Successfully fetched framework!',
      data: technologiesItem,
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete('frameworks/:id')
  async removeFramework(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.technologiesService.removeFramework(id);

    return { message: 'Framework successfully deleted!' };
  }

  @Public()
  @Get('hiring-menu/:id')
  @ApiOkResponse({ type: TechnologiesHiringMenu })
  async findOneMenu(@Param('id') id: string) {
    const technologiesItem = await this.technologiesService.findOneMenu(id);
    if (!technologiesItem)
      throw new NotFoundException("Hiring Menu doesn't exist!");

    return {
      message: 'Successfully fetched Hiring Menu!',
      data: technologiesItem,
    };
  }

  @ApiOkResponse({ type: DeleteDto })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Delete('hiring-menu/:id')
  async removeMenu(@Param('id') id: number) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    await this.technologiesService.removeMenu(id);

    return { message: 'Menu successfully deleted!' };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: TechnologiesHiringMenu })
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch('hiring-menu/:id')
  async updateMenu(
    @Param('id') id: number,
    @Body() technologiesData: UpdateTechnologiesHiringMenuDto,
  ) {
    if (isNaN(id)) throw new BadRequestException('Invalid ID!');

    const data = await this.technologiesService.updateMenu(id, {
      ...technologiesData,
    });

    return {
      message: 'Successfully updated hiring menu!',
      data,
    };
  }
}
