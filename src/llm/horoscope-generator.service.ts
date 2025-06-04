import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from './llm.service';
// import { HoroscopeResponseDto } from '../horoscope/models/horoscope.dto';
// import { ZodiacSign } from '../users/entities/zodiac-sign.enum'; // Will be in GenerateHoroscopeParamsDto
import { GenerateHoroscopeParamsDto } from './models/generate-horoscope-params.dto'; // Added import
import {
  horoscopePromptTemplate,
  extractScoresPromptTemplate,
} from './prompts/horoscope-prompt';
// import { HoroscopeHistory } from 'src/horoscope/models/horoscope-history.entity';

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
  ): Promise<GeneratedHoroscopeContent> {
    this.logger.log(
      `Generating horoscope for zodiac sign: ${params.sign}, Date of Birth: ${params.dateOfBirth || 'N/A'}, Birth Time: ${params.birthTime || 'N/A'}`,
    );
    const date = new Date().toISOString().split('T')[0];

    try {
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

      // Tăng max_tokens để đảm bảo đủ độ dài cho tất cả các phần
      const horoscopeText = await this.llmService.generateText(
        horoscopePromptTemplate,
        promptVariables,
      );

      // Tách các phần và đảm bảo mỗi phần đều có nội dung
      const sections = horoscopeText
        .split('\n\n')
        .filter(Boolean)
        .map((section) => section.trim());

      if (sections.length < 5) {
        this.logger.warn(
          `Not enough sections in generated horoscope for ${params.sign}. Expected 5, got ${sections.length}`,
        );
        while (sections.length < 5) {
          sections.push('');
        }
      }

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

      // Hàm helper để xử lý text
      const processText = (text: string) => {
        if (!text) return 'No horoscope available.';
        return text
          .replace(/\\n/g, '\n') // Thay thế \n bằng xuống dòng thực sự
          .replace(/^[^:]+:\n/, '') // Xóa phần tiêu đề và dấu xuống dòng sau nó
          .trim(); // Xóa khoảng trắng thừa
      };

      // Kiểm tra và xử lý từng phần
      const overview = processText(sections[0]);
      const loveAndRelationships = processText(sections[1]);
      const careerAndStudies = processText(sections[2]);
      const healthAndWellbeing = processText(sections[3]);
      const moneyAndFinances = processText(sections[4]);

      // Log để debug
      this.logger.debug('Generated sections:', {
        overview: overview.length,
        loveAndRelationships: loveAndRelationships.length,
        careerAndStudies: careerAndStudies.length,
        healthAndWellbeing: healthAndWellbeing.length,
        moneyAndFinances: moneyAndFinances.length,
      });

      return {
        sign: params.sign,
        date,
        scores: {
          health: scores.health || 70,
          love: scores.love || 70,
          career: scores.career || 70,
        },
        overview,
        loveAndRelationships,
        careerAndStudies,
        healthAndWellbeing,
        moneyAndFinances,
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

export interface GeneratedHoroscopeContent {
  sign: string;
  date: string;
  scores: { health: number; love: number; career: number };
  overview: string;
  loveAndRelationships: string;
  careerAndStudies: string;
  healthAndWellbeing: string;
  moneyAndFinances: string;
}
