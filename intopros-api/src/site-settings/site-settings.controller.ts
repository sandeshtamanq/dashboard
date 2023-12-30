import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../@guards/jwt-auth.guard';
import { RolesGuard } from '../@guards/roles.guard';

import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../@decorators/role.decorator';

import { UpdateSiteSettingDto } from './dto/site-setting.dto';
import { SiteSettingsService } from './site-settings.service';
import { SiteSetting } from './entities/site-setting.entity';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { imageUploadFilter, multerDiskStorage } from '../@utils/fileValidator';

@ApiTags('Site Settings')
@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  async findSetting() {
    const data = await this.siteSettingsService.getSettings();

    return {
      data,
      message: 'Successfully fetched site settings!',
    };
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: SiteSetting })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'headerLogo',
          maxCount: 1,
        },
        {
          name: 'footerLogo',
          maxCount: 1,
        },
      ],
      {
        fileFilter: imageUploadFilter,
        storage: multerDiskStorage,
      },
    ),
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Patch()
  async update(
    @Body() updateSiteSettingDto: UpdateSiteSettingDto,
    @UploadedFiles()
    files: {
      headerLogo?: Express.Multer.File[];
      footerLogo?: Express.Multer.File[];
    },
  ) {
    const data = await this.siteSettingsService.updateSettings({
      ...updateSiteSettingDto,
      ...(files.headerLogo
        ? { headerLogo: `/${files.headerLogo.map((e) => e.path)}` }
        : {}),
      ...(files.footerLogo
        ? { footerLogo: `/${files.footerLogo.map((e) => e.path)}` }
        : {}),
    });

    return {
      data,
      message: 'Successfully updated site settings!',
    };
  }
}
