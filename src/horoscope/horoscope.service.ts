import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HoroscopeResponseDto } from './models/horoscope.dto';
import { ZodiacSign } from '../users/entities/zodiac-sign.enum';
import { HoroscopeGeneratorService } from '../llm/horoscope-generator.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HoroscopeService {
  private readonly logger = new Logger(HoroscopeService.name);
  private personalizedHoroscopeCache: Map<string, HoroscopeResponseDto> =
    new Map(); // User-specific daily cache

  constructor(private readonly horoscopeGenerator: HoroscopeGeneratorService) {
    this.logger.log(
      'HoroscopeService initialized. Personalized cache is active.',
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron(): void {
    this.logger.log(
      'Starting scheduled daily clearing of personalized horoscope cache',
    );
    try {
      this.personalizedHoroscopeCache.clear();
      this.logger.log('Personalized horoscope cache cleared successfully');
    } catch (error) {
      this.logger.error(
        `Failed during daily clearing of personalized horoscope cache: ${error.message}`,
        error.stack,
      );
    }
  }

  async getHoroscope(user: User): Promise<HoroscopeResponseDto> {
    const todayDate: string = new Date().toISOString().split('T')[0];
    const userSign = user.zodiacSign;
    const userId = user.id;

    this.logger.debug(
      `Horoscope requested for user ${userId} (sign: ${userSign}) for date: ${todayDate}`,
    );

    if (!userSign || userSign === ZodiacSign.UNKNOWN) {
      this.logger.warn(
        `User ${userId} has invalid/unknown sign: ${userSign}. Cannot provide horoscope.`,
      );
      throw new NotFoundException(
        `Invalid or unknown zodiac sign for user ${userId}. Please update your profile.`,
      );
    }

    const personalizedCacheKey = `${userId}-${todayDate}`;
    const cachedPersonalizedHoroscope =
      this.personalizedHoroscopeCache.get(personalizedCacheKey);

    if (
      cachedPersonalizedHoroscope &&
      cachedPersonalizedHoroscope.date === todayDate
    ) {
      this.logger.log(
        `Returning cached personalized horoscope for user ${userId} for date ${todayDate}`,
      );
      return cachedPersonalizedHoroscope;
    }

    this.logger.log(
      `No valid personalized horoscope in cache for user ${userId} for ${todayDate}. Generating new one.`,
    );

    try {
      const dateOfBirthFormatted = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split('T')[0]
        : undefined;

      const generatedHoroscope =
        await this.horoscopeGenerator.generateHoroscope({
          sign: userSign,
          dateOfBirth: dateOfBirthFormatted,
          birthTime: user.birthTime,
        });

      this.personalizedHoroscopeCache.set(
        personalizedCacheKey,
        generatedHoroscope,
      );
      this.logger.log(
        `Generated and cached personalized horoscope for user ${userId} for date ${todayDate}`,
      );
      return generatedHoroscope;
    } catch (error) {
      this.logger.error(
        `Failed to generate personalized horoscope for user ${userId} (sign: ${userSign}): ${error.message}`,
        error.stack,
      );
      throw new NotFoundException(
        `Horoscope data could not be generated for user ${userId}. Please try again later.`,
      );
    }
  }
  // Removed updateHoroscopeCache method and horoscopeCache property
}
