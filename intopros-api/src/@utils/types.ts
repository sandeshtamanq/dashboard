import { ApiProperty } from '@nestjs/swagger';

interface IPagination {
  total: number;
  perPage: number;
}

export class PaginatedDto<TData> {
  @ApiProperty({
    type: 'json',
    required: false,
    example: { total: 5, perPage: 5 },
  })
  pagination?: IPagination;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Successfully fetched data!',
  })
  message?: string;

  data: TData[];
}

export class GenericResponseDto<TData> {
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Successfully fetched data!',
  })
  message?: string;

  data: TData;
}

export class DeleteDto {
  @ApiProperty({
    type: 'string',
    example: 'Successfully deleted data!',
  })
  message: string;
}
