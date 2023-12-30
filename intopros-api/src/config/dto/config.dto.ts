import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConfigDto {
  @IsString()
  @ApiProperty({ example: 'Config Item' })
  readonly name!: string;
}
