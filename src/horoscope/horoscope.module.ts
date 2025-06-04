import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoroscopeController } from './horoscope.controller';
import { HoroscopeService } from './horoscope.service';
import { LLMModule } from '../llm/llm.module';
import { HoroscopeHistory } from './models/horoscope-history.entity';
import { UserBirthDate } from 'src/users/entities/user-birth-date.entity';
import { ZodiacService } from '../users/services/zodiac.service';

@Module({
  imports: [
    LLMModule,
    TypeOrmModule.forFeature([HoroscopeHistory, UserBirthDate]),
  ],
  controllers: [HoroscopeController],
  providers: [HoroscopeService, ZodiacService],
})
export class HoroscopeModule {}
