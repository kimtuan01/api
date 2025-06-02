import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

class HoroscopeScoresDto {
  @ApiProperty({
    description: 'Health score percentage',
    example: 80,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  readonly health: number;

  @ApiProperty({
    description: 'Love score percentage',
    example: 80,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  readonly love: number;

  @ApiProperty({
    description: 'Career score percentage',
    example: 80,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  readonly career: number;
}

export class HoroscopeResponseDto {
  @ApiProperty({
    description: 'Zodiac sign name',
    example: 'Scorpio',
  })
  @IsString()
  @IsNotEmpty()
  readonly sign: string;

  @ApiProperty({
    description: 'Date the horoscope is for',
    example: '2024-07-27',
  })
  @IsString() // Or Date, depending on desired format
  @IsNotEmpty()
  readonly date: string; // Using string for simplicity, could be Date object

  @ApiProperty({
    type: HoroscopeScoresDto,
    description: 'Scores for different life aspects',
  })
  readonly scores: HoroscopeScoresDto;

  @ApiProperty({
    description: 'Overall horoscope overview',
    example: 'Emotions run deep today...',
  })
  @IsString()
  @IsNotEmpty()
  readonly overview: string;

  @ApiProperty({
    description: 'Horoscope for love and relationships',
    example: 'Emotions run deep today...',
  })
  @IsString()
  @IsNotEmpty()
  readonly loveAndRelationships: string;

  @ApiProperty({
    description: 'Horoscope for career and studies',
    example: 'Emotions run deep today...',
  })
  @IsString()
  @IsNotEmpty()
  readonly careerAndStudies: string;

  @ApiProperty({
    description: 'Horoscope for health and well-being',
    example: 'Emotions run deep today...',
  })
  @IsString()
  @IsNotEmpty()
  readonly healthAndWellbeing: string;

  @ApiProperty({
    description: 'Horoscope for money and finances',
    example: 'Emotions run deep today...',
  })
  @IsString()
  @IsNotEmpty()
  readonly moneyAndFinances: string;
}
