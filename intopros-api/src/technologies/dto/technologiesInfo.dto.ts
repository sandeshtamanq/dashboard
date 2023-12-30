import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTechnologiesInfoDto {
  @IsString()
  @ApiProperty({ example: 'Love the clean design and easy to use interfaces!' })
  readonly title: string;

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

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ example: ['python', 'django'], required: false })
  readonly technologies?: string[];
}


export class UpdateTechnologiesInfoDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Love the clean design and easy to use interfaces!',
    required: false,
  })
  readonly title: string;

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

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ example: ['python', 'django'], required: false })
  readonly technologies?: string[];
}
