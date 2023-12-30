import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTestimonialDto {
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
  @ApiProperty({ example: 'John Doe' })
  readonly name: string;

  @IsString()
  @ApiProperty({ example: 'Software Engineer' })
  readonly designation: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  readonly image!: any;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false, example: true })
  readonly isActive?: boolean;
}

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}
