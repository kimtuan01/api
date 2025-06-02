import { Module } from '@nestjs/common';
import { HoroscopeController } from './horoscope.controller';
import { HoroscopeService } from './horoscope.service';
import { LLMModule } from '../llm/llm.module';

@Module({
  imports: [LLMModule],
  controllers: [HoroscopeController],
  providers: [HoroscopeService],
})
export class HoroscopeModule {}
