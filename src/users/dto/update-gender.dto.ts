import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGenderDto {
  @ApiProperty({
    description: 'User gender',
    example: 'male',
    minLength: 1,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  gender: string;
}
