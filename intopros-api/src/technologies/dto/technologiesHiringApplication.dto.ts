import { IsEmail, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateHiringApplicationDto {
  @IsString()
  @ApiProperty({ example: 'Santosh Bhandari' })
  readonly name!: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @ApiProperty({ example: 'contact@santoshb.com.np' })
  readonly email!: string;

  @IsString()
  @ApiProperty({ example: 'PHP' })
  readonly tech!: string;

  @IsString()
  @ApiProperty({ example: 'Full Time Hiring' })
  readonly packageID!: string;

  @IsString()
  @ApiProperty({ example: '20000' })
  readonly budget!: string;

  @IsString()
  @ApiProperty({
    example:
      'This is the message for which I have made this contact us message',
  })
  readonly message!: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  readonly file!: any;

}

export class UpdateHiringApplicationDto extends PartialType(CreateHiringApplicationDto) {}
