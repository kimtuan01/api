import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'password123',
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  // @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'password123',
    minLength: 8,
  })
  @IsString({ message: 'Confirm Password must be a string' })
  @IsNotEmpty({ message: 'Confirm Password is required' })
  // @MinLength(8, {
  //   message: 'Confirm Password must be at least 8 characters long',
  // })
  confirmPassword: string;
}
