import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  Min,
  Max,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({
    description: 'User latitude coordinate',
    example: 37.7749,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  readonly latitude: number;

  @ApiProperty({
    description: 'User longitude coordinate',
    example: -122.4194,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  readonly longitude: number;

  @ApiProperty({
    description: 'User full address',
    example: '123 Main St, San Francisco, CA 94105, USA',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  readonly address?: string;
}
