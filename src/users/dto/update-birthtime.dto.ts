import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBirthtimeDto {
  @ApiProperty({
    description: 'User birth time (HH:MM:SS)',
    example: '14:30:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'Birth time must be in the format HH:MM:SS',
  })
  birthTime: string;
}
