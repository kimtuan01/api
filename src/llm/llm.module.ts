import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LLMService } from './llm.service';
import { HoroscopeGeneratorService } from './horoscope-generator.service';
import llmConfig from '../config/llm.config';

@Module({
  imports: [ConfigModule.forFeature(llmConfig)],
  providers: [LLMService, HoroscopeGeneratorService],
  exports: [LLMService, HoroscopeGeneratorService],
})
export class LLMModule {}
