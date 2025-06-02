import { IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBirthdateDto {
  @ApiProperty({
    description: 'User date of birth',
    example: '1990-01-15',
    type: Date,
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;
}
