import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly image!: any;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, example: 'cms' })
  readonly category?: any;
}

export class RemoveUploadDto {
  @IsString({ each: true })
  @ApiProperty({
    type: 'string',
    isArray: true,
    example: ['/uploads/image.png'],
  })
  images: string[];
}
