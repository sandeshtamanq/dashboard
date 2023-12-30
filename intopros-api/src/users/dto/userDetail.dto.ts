import {
  IsBoolean,
  IsString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';


// User details
class CreateUserDetailDto {
  @IsString()
  @ApiProperty({ example: 'Santosh' })
  readonly firstName: string;

  @IsString()
  @ApiProperty({ example: 'I_dont_have_one' })
  readonly middleName: string;

  @IsString()
  @ApiProperty({ example: 'Bhandari' })
  readonly lastName: string;


  @IsString()
  @ApiProperty({ example: 'Bouddha-6 Mahankal, Kathmandu, Nepal' })
  readonly address: string;

  @IsString()
  @ApiProperty({ example: '+977-9800000000' })
  readonly mobile: string;

  @IsString()
  @ApiProperty({ example: '+977-010000000' })
  readonly telephone: string;

  @IsBoolean()
  @ApiProperty({ example: true })
  readonly isActive: boolean;

  @IsBoolean()
  @ApiProperty({ example: true })
  readonly isBlocked: boolean;
}

export class UpdateUserDetailDto extends PartialType(CreateUserDetailDto) {}

