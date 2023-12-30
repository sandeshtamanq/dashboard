import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

// use decorator from class validator
export class UpdateProfileWeightageDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({ type: Number, minimum: 0, maximum: 100, example: 10 })
  basicInfo: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({ type: Number, minimum: 0, maximum: 100, example: 10 })
  about: number;

}
