import { Injectable } from '@nestjs/common';
import { ZodiacSign } from '../entities/zodiac-sign.enum';

interface ZodiacSignData {
  name: ZodiacSign;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

@Injectable()
export class ZodiacService {
  private readonly zodiacSigns: ZodiacSignData[] = [
    {
      name: ZodiacSign.ARIES,
      startMonth: 3,
      startDay: 21,
      endMonth: 4,
      endDay: 19,
    },
    {
      name: ZodiacSign.TAURUS,
      startMonth: 4,
      startDay: 20,
      endMonth: 5,
      endDay: 20,
    },
    {
      name: ZodiacSign.GEMINI,
      startMonth: 5,
      startDay: 21,
      endMonth: 6,
      endDay: 20,
    },
    {
      name: ZodiacSign.CANCER,
      startMonth: 6,
      startDay: 21,
      endMonth: 7,
      endDay: 22,
    },
    {
      name: ZodiacSign.LEO,
      startMonth: 7,
      startDay: 23,
      endMonth: 8,
      endDay: 22,
    },
    {
      name: ZodiacSign.VIRGO,
      startMonth: 8,
      startDay: 23,
      endMonth: 9,
      endDay: 22,
    },
    {
      name: ZodiacSign.LIBRA,
      startMonth: 9,
      startDay: 23,
      endMonth: 10,
      endDay: 22,
    },
    {
      name: ZodiacSign.SCORPIO,
      startMonth: 10,
      startDay: 23,
      endMonth: 11,
      endDay: 21,
    },
    {
      name: ZodiacSign.SAGITTARIUS,
      startMonth: 11,
      startDay: 22,
      endMonth: 12,
      endDay: 21,
    },
    {
      name: ZodiacSign.CAPRICORN,
      startMonth: 12,
      startDay: 22,
      endMonth: 1,
      endDay: 19,
    },
    {
      name: ZodiacSign.AQUARIUS,
      startMonth: 1,
      startDay: 20,
      endMonth: 2,
      endDay: 18,
    },
    {
      name: ZodiacSign.PISCES,
      startMonth: 2,
      startDay: 19,
      endMonth: 3,
      endDay: 20,
    },
  ];

  /**
   * Calculates the zodiac sign based on birth date
   * @param dateOfBirth - Date of birth as a Date object or string (YYYY-MM-DD)
   * @returns The zodiac sign enum value
   */
  calculateZodiacSign(dateOfBirth: Date | string): ZodiacSign {
    const date =
      typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();

    // Find matching zodiac sign
    for (const sign of this.zodiacSigns) {
      // Handle special case for Capricorn (spans December to January)
      if (sign.name === ZodiacSign.CAPRICORN) {
        if (
          (month === 12 && day >= sign.startDay) ||
          (month === 1 && day <= sign.endDay)
        ) {
          return sign.name;
        }
      } else if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay)
      ) {
        return sign.name;
      }
    }

    // Default fallback (shouldn't reach here if zodiac data is correct)
    return ZodiacSign.UNKNOWN;
  }
}
