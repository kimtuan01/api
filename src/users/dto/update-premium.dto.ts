import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserPremium } from '../entities/user-premium.enum';

export class UpdatePremiumDto {
  @ApiProperty({
    description: 'User premium status',
    example: 'Monthly',
    enum: UserPremium,
  })
  @IsNotEmpty()
  @IsEnum(UserPremium)
  isPremium: UserPremium;
}
