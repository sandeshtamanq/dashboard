import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  @ApiProperty({ type: 'string', required: true, example: 'Homepage' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Dynamic description for the gallery.',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'https://google.com',
  })
  link?: string;

  @IsString({ each: true })
  @ApiProperty({
    type: 'string',
    isArray: true,
    required: true,
    example: ['https://link.com/1.jpeg', 'https://link.com/2.jpeg'],
  })
  readonly images: string[];
}
