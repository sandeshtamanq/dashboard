import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateServicesDto {
  @IsString()
  @ApiProperty({ example: 'Love the clean design and easy to use interfaces!' })
  readonly title: string;

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ example: ['Job', 'Career'], required: false })
  readonly tags?: string[];

  @IsString()
  @ApiProperty({
    example:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  })
  readonly shortDescription: string;

  @IsString()
  @ApiProperty({
    example:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  })
  readonly description: string;


  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly image?: any;
}

export class UpdateServicesDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Love the clean design and easy to use interfaces!',
    required: false,
  })
  readonly title: string;

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ example: ['Job', 'Career'], required: false })
  readonly tags?: string[];

  @IsBooleanString()
  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false, example: true })
  readonly isActive?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    required: false,
  })
  readonly shortDescription: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    required: false,
  })
  readonly description: string;


  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly image!: any;
}
