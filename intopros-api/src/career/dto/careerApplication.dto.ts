import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum Status {
  NEW = 'new',
  GOODFIT = 'goodFit',
  NOTFIT = 'notFit',
  EMAILED = 'emailed',
  INTERVIEWED = 'interviewed',
  SELECTED = 'selected',
  REJECTED = 'rejected',
}

export class CreateApplicationDto {
  @IsString()
  @ApiProperty({ example: 'Santosh Bhandari' })
  readonly name!: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @ApiProperty({ example: 'contact@santoshb.com.np' })
  readonly email!: string;

  @IsString()
  @ApiProperty({ example: '123' })
  readonly careerID!: string;

  @IsString()
  @ApiProperty({
    example:
      'This is the message for which I have made this contact us message',
  })
  readonly coverLetter!: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  readonly file!: any;
}

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @IsEnum(Status)
  @ApiProperty({ example: 'goodFit' })
  status: Status;

  @IsString()
  @IsOptional()
  remark: string;
}
