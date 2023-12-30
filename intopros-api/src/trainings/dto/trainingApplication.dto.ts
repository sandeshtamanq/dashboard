import { IsEmail, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTrainingApplicationDto {
  @IsString()
  @ApiProperty({ example: 'Santosh Bhandari' })
  readonly name!: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @ApiProperty({ example: 'contact@santoshb.com.np' })
  readonly email!: string;

  @IsString()
  @ApiProperty({ example: '123' })
  readonly trainingID!: string;

  @IsString()
  @ApiProperty({
    example:
      'This is the message for which I have made this contact us message',
  })
  readonly subject!: string;

  @IsString()
  @ApiProperty({
    example:
      'This is the message for which I have made this contact us message',
  })
  readonly message!: string;

}

export class UpdateTrainingApplicationDto extends PartialType(CreateTrainingApplicationDto) {}
