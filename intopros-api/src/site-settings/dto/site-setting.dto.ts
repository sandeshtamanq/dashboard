import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateSiteSettingDto {
  //for office 1
  @IsString()
  @ApiProperty({ example: 'Kathmandu office' })
  officeName: string;

  @IsString()
  @ApiProperty({ example: 'Kathmandu, Nepal' })
  address: string;

  @IsString()
  @ApiProperty({ example: '9841234567' })
  phone: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @ApiProperty({ example: 'contact@intopros.com' })
  email: string;

  //for office 2
  @IsString()
  @ApiProperty({ example: 'Sydney Office' })
  officeName2: string;

  @IsString()
  @ApiProperty({ example: 'Kathmandu, Nepal' })
  address2: string;

  @IsString()
  @ApiProperty({ example: '9841234567' })
  phone2: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @ApiProperty({ example: 'contact@intopros.com' })
  email2: string;

  @IsString()
  @ApiProperty({ example: 'https://www.facebook.com/intopros' })
  facebook: string;

  @IsString()
  @ApiProperty({ example: 'https://twitter.com/intopros' })
  twitter: string;

  @IsString()
  @ApiProperty({ example: 'https://www.linkedin.com/company/intopros' })
  linkedIn: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly headerLogo?: any;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly footerLogo?: any;
}

export class UpdateSiteSettingDto {
  //for office 1
  @IsString()
  @ApiProperty({ example: 'Kathmandu office' })
  officeName: string;

  @IsString()
  @ApiProperty({ example: 'Kathmandu, Nepal' })
  address: string;

  @IsString()
  @ApiProperty({ example: '9841234567' })
  phone: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @ApiProperty({ example: 'contact@intopros.com' })
  email: string;

  //for office 2
  @IsString()
  @ApiProperty({ example: 'Sydney office' })
  officeName2: string;

  @IsString()
  @ApiProperty({ example: 'Kathmandu, Nepal' })
  address2: string;

  @IsString()
  @ApiProperty({ example: '9841234567' })
  phone2: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @ApiProperty({ example: 'contact@intopros.com' })
  email2: string;

  @IsString()
  @ApiProperty({ example: 'https://www.facebook.com/intopros' })
  facebook: string;

  @IsString()
  @ApiProperty({ example: 'https://twitter.com/intopros' })
  twitter: string;

  @IsString()
  @ApiProperty({ example: 'https://www.linkedin.com/company/intopros' })
  linkedIn: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly headerLogo!: any;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly footerLogo!: any;
}
