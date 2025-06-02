import { ZodiacSign } from '../../users/entities/zodiac-sign.enum';

export class GenerateHoroscopeParamsDto {
  sign: ZodiacSign;
  dateOfBirth?: string; // YYYY-MM-DD
  birthTime?: string; // HH:MM:SS or HH:MM
}
