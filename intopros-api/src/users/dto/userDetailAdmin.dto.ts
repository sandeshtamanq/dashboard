import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';


import { UserRole } from '../entities/user.entity';

// User details
class CreateUserByAdminDto {
  // For user
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @ApiProperty({ example: 'contact@santoshb.com.np' })
  readonly email: string;

  @IsString()
  @ApiProperty({ example: 'bsantosh909' })
  readonly username: string;

  @IsString()
  @ApiProperty({ example: 'bsantosh909' })
  readonly password: string;

  @IsEnum(UserRole)
  @ApiProperty({ example: UserRole.USER })
  readonly role: UserRole;

  // For user details
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

  @IsBoolean()
  @ApiProperty({ example: true })
  readonly isProfileVerified: boolean;

  @IsString()
  @ApiProperty({ example: 'Inappropriate profile picture' })
  readonly verificationRemark: string;

}

export class UpdateUserByAdminDto extends PartialType(CreateUserByAdminDto) {}
