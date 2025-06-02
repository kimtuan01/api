import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from './llm.service';
import { HoroscopeResponseDto } from '../horoscope/models/horoscope.dto';
// import { ZodiacSign } from '../users/entities/zodiac-sign.enum'; // Will be in GenerateHoroscopeParamsDto
import { GenerateHoroscopeParamsDto } from './models/generate-horoscope-params.dto'; // Added import
import {
  horoscopePromptTemplate,
  extractScoresPromptTemplate,
} from './prompts/horoscope-prompt';

/**
 * Service for generating horoscope data using LLM
 */
@Injectable()
export class HoroscopeGeneratorService {
  private readonly logger = new Logger(HoroscopeGeneratorService.name);

  constructor(private readonly llmService: LLMService) {}

  /**
   * Generate a horoscope for a specific zodiac sign, optionally using birth date and time.
   *
   * @param params - Parameters for horoscope generation, including sign, and optionally dateOfBirth and birthTime.
   * @returns A HoroscopeResponseDto containing the generated horoscope.
   */
  async generateHoroscope(
    params: GenerateHoroscopeParamsDto,
  ): Promise<HoroscopeResponseDto> {
    this.logger.log(
      `Generating horoscope for zodiac sign: ${params.sign}, Date of Birth: ${params.dateOfBirth || 'N/A'}, Birth Time: ${params.birthTime || 'N/A'}`,
    );
    const date = new Date().toISOString().split('T')[0];

    try {
      // Prepare prompt variables
      const promptVariables: Record<string, any> = {
        zodiacSign: params.sign,
        date,
      };
      if (params.dateOfBirth) {
        promptVariables.dateOfBirth = params.dateOfBirth;
      }
      if (params.birthTime) {
        promptVariables.birthTime = params.birthTime;
      }

      // Generate the raw horoscope text
      const horoscopeText = await this.llmService.generateText(
        horoscopePromptTemplate,
        promptVariables,
      );

      // Split the text into sections (assumes newline separation)
      const sections = horoscopeText.split('\n\n').filter(Boolean);

      if (sections.length < 5) {
        this.logger.warn(
          `Not enough sections in generated horoscope for ${params.sign}. Expected 5, got ${sections.length}`,
        );
        // Ensure we have at least 5 sections, even if some are empty
        while (sections.length < 5) {
          sections.push('');
        }
      }

      // Extract the scores using a separate prompt
      const scoresJson = await this.llmService.generateText(
        extractScoresPromptTemplate,
        { horoscopeText },
      );

      let scores;
      try {
        scores = JSON.parse(scoresJson);
      } catch (error) {
        this.logger.error(
          `Failed to parse scores JSON: ${error.message}. Using default scores.`,
        );
        scores = { health: 70, love: 70, career: 70 };
      }

      // Create and return the DTO
      return {
        sign: params.sign,
        date,
        scores: {
          health: scores.health || 70,
          love: scores.love || 70,
          career: scores.career || 70,
        },
        overview: sections[0] || 'No overview available.',
        loveAndRelationships: sections[1] || 'No love horoscope available.',
        careerAndStudies: sections[2] || 'No career horoscope available.',
        healthAndWellbeing: sections[3] || 'No health horoscope available.',
        moneyAndFinances: sections[4] || 'No finance horoscope available.',
      };
    } catch (error) {
      this.logger.error(
        `Error generating horoscope for ${params.sign}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
