import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class GenerateHoroscopeDto {
  @ApiProperty({
    description: 'Date of birth (YYYY-MM-DD)',
    example: '1990-01-15',
  })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;
}
