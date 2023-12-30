import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCareerCategoryDto {

  @IsString()
  @ApiProperty({
    example:
      "Android Developer",
  })
  readonly category: string;

}

export class UpdateCareerCategoryDto {

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      "Android Developer",
    required: false,
  })
  readonly category: string;

  @IsBooleanString()
  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false, example: true })
  readonly isActive?: string;

}
