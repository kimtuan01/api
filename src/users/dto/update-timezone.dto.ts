import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateTimezoneDto {
  @ApiProperty({
    description: 'User timezone',
    example: 'America/Los_Angeles',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly timezone: string;
}
