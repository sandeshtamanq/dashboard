import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateCmsDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'number', example: 1, required: false })
  id?: number;

  @IsString()
  @ApiProperty({ type: 'string', example: 'News' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', example: 'block-1', required: false })
  slug?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'This is the complete body for the CMS page',
  })
  description: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: '/uploads/randomImageUrl.png',
    required: false,
  })
  image: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: 'boolean', example: true, required: false })
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'This is the meta:description value for the page',
    required: false,
  })
  metaDescription?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateCmsDto)
  @ApiProperty({
    type: CreateCmsDto,
    isArray: true,
    example: [
      {
        title: 'Popular news',
        description: 'Popular news section HTML body',
        image: '/uploads/anotherImageUrl.png',
      },
    ],
  })
  children: CreateCmsDto[];
}
