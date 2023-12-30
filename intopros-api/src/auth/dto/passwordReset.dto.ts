import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetInitDto {
  @IsString()
  @ApiProperty({ example: 'contact@santoshb.com.np' })
  readonly username!: string;
}

export class PasswordResetFinalDto {
  @IsString()
  @MinLength(8)
  @ApiProperty({ minLength: 8, example: 'Secret@123' })
  readonly password!: string;

  @IsString()
  @ApiProperty({ example: 'super-secret-token-you-recieved-in-mail' })
  readonly token!: string;
}
