import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateUploadDto } from './dto/upload.dto';
import { JwtAuthGuard } from '../@guards/jwt-auth.guard';

import { imageUploadFilter, multerDiskStorage } from '../@utils/fileValidator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageUploadFilter,
      storage: multerDiskStorage,
    }),
  )
  @Post('image')
  create(
    @Body() _: CreateUploadDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (!image) throw new BadRequestException("File wasn't uploaded");

    return {
      message: 'File was uploaded successfully',
      data: {
        image: `/${image.path}`,
      },
    };
  }
}
