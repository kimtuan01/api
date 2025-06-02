import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'User gender',
    example: 'female',
  })
  @IsString({ message: 'Gender must be a string' })
  @IsNotEmpty({ message: 'Gender is required' })
  gender: string;

  @ApiProperty({
    description: 'User date of birth (YYYY-MM-DD)',
    example: '1990-01-15',
  })
  @IsDateString(
    {},
    { message: 'Date of birth must be a valid date in YYYY-MM-DD format' },
  )
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;

  @ApiProperty({
    description: 'User birth time (HH:MM:SS)',
    example: '08:30:00',
  })
  @IsString({ message: 'Birth time must be a string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Birth time must be in the format HH:MM:SS (24-hour)',
  })
  @IsNotEmpty({ message: 'Birth time is required' })
  birthTime: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    required: false,
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;
}
