import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class CreateBlogCategoryDto {

  @IsString()
  @ApiProperty({
    example:
      "Android Developer",
  })
  readonly category: string;
 
}

export class UpdateBlogCategoryDto {
    @IsString()
    @ApiProperty({
      example:
        "Android Developer",
    })
    readonly category: string;
 
}
