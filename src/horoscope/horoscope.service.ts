import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { HoroscopeGeneratorService } from '../llm/horoscope-generator.service';
import { User } from '../users/entities/user.entity';
import { HoroscopeHistory } from './models/horoscope-history.entity';
import { UserBirthDate } from '../users/entities/user-birth-date.entity';
import { GenerateHoroscopeDto } from './models/generate-horoscope.dto';
import { ZodiacService } from '../users/services/zodiac.service';

@Injectable()
export class HoroscopeService {
  private readonly logger = new Logger(HoroscopeService.name);
  private personalizedHoroscopeCache: Map<string, HoroscopeHistory> = new Map();

  constructor(
    private readonly horoscopeGenerator: HoroscopeGeneratorService,
    @InjectRepository(HoroscopeHistory)
    private readonly horoscopeHistoryRepository: Repository<HoroscopeHistory>,
    @InjectRepository(UserBirthDate)
    private readonly userBirthDateRepository: Repository<UserBirthDate>,
    private readonly zodiacService: ZodiacService,
  ) {
    this.logger.log(
      'HoroscopeService initialized. Personalized cache and history storage are active.',
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron(): Promise<void> {
    this.logger.log(
      'Starting scheduled daily clearing of personalized horoscope cache and cleanup of old records',
    );
    try {
      this.personalizedHoroscopeCache.clear();
      this.logger.log('Personalized horoscope cache cleared successfully');
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const result = await this.horoscopeHistoryRepository.delete({
        createdAt: LessThan(thirtyDaysAgo),
      });
      this.logger.log(`Cleaned up ${result.affected} old horoscope records`);
    } catch (error) {
      this.logger.error(
        `Failed during daily maintenance: ${error.message}`,
        error.stack,
      );
    }
  }

  async generateAndSaveHoroscope(
    user: User,
    generateHoroscopeDto: GenerateHoroscopeDto,
  ): Promise<HoroscopeHistory> {
    if (!user.birthTime) {
      throw new NotFoundException(
        'User birth time not found. Please update your birth time in profile.',
      );
    }

    const dateOfBirth = new Date(generateHoroscopeDto.dateOfBirth);
    const sign = this.zodiacService.calculateZodiacSign(dateOfBirth);
    const today = new Date().toISOString().split('T')[0];

    // Kiểm tra xem đã có user birth date chưa
    const existingBirthDate = await this.userBirthDateRepository.findOne({
      where: {
        userId: user.id,
        dateOfBirth: dateOfBirth,
      },
    });

    // Tạo hoặc cập nhật user birth date
    const userBirthDate = existingBirthDate || new UserBirthDate();
    if (!existingBirthDate) {
      userBirthDate.userId = user.id;
      userBirthDate.dateOfBirth = dateOfBirth;
      userBirthDate.zodiacSign = sign;
      await this.userBirthDateRepository.save(userBirthDate);
    }

    // Kiểm tra xem đã có horoscope cho ngày hôm nay chưa
    const existingHoroscope = await this.horoscopeHistoryRepository.findOne({
      where: {
        userId: user.id,
        userBirthDateId: userBirthDate.id,
        date: today,
      },
    });

    if (existingHoroscope) {
      this.logger.debug(
        `Found existing horoscope for user ${user.id} for today: ${today}`,
      );
      return existingHoroscope;
    }

    // Tạo horoscope mới cho ngày hôm nay
    const generatedHoroscope = await this.horoscopeGenerator.generateHoroscope({
      sign,
      dateOfBirth: dateOfBirth.toISOString().split('T')[0],
      birthTime: user.birthTime,
    });

    const horoscopeHistory = new HoroscopeHistory();
    horoscopeHistory.userId = user.id;
    horoscopeHistory.userBirthDateId = userBirthDate.id;
    horoscopeHistory.sign = generatedHoroscope.sign;
    horoscopeHistory.date = today;
    horoscopeHistory.scores = generatedHoroscope.scores;
    horoscopeHistory.overview = generatedHoroscope.overview;
    horoscopeHistory.loveAndRelationships =
      generatedHoroscope.loveAndRelationships;
    horoscopeHistory.careerAndStudies = generatedHoroscope.careerAndStudies;
    horoscopeHistory.healthAndWellbeing = generatedHoroscope.healthAndWellbeing;
    horoscopeHistory.moneyAndFinances = generatedHoroscope.moneyAndFinances;
    horoscopeHistory.isSave = false;

    await this.horoscopeHistoryRepository.save(horoscopeHistory);
    this.logger.log(
      `Generated and saved horoscope for user ${user.id} for today ${today}`,
    );
    return horoscopeHistory;
  }

  async updateIsSave(userId: string, id: string): Promise<HoroscopeHistory> {
    const history = await this.horoscopeHistoryRepository.findOne({
      where: { id, userId },
    });
    if (!history) throw new NotFoundException('Horoscope history not found');
    history.isSave = true;
    return this.horoscopeHistoryRepository.save(history);
  }

  async getSavedHoroscopeHistory(userId: string): Promise<HoroscopeHistory[]> {
    return this.horoscopeHistoryRepository.find({
      where: { userId, isSave: true },
      order: { date: 'DESC' },
    });
  }

  async getHoroscopeById(
    userId: string,
    id: string,
  ): Promise<HoroscopeHistory> {
    const horoscope = await this.horoscopeHistoryRepository.findOne({
      where: { id, userId },
    });
    if (!horoscope) throw new NotFoundException('Horoscope with ID not found');
    return horoscope;
  }

  async generateAndSaveHoroscopeForUser(user: User): Promise<HoroscopeHistory> {
    if (!user.dateOfBirth) {
      throw new NotFoundException(
        'User birth date not found. Please update your birth date in profile.',
      );
    }

    if (!user.birthTime) {
      throw new NotFoundException(
        'User birth time not found. Please update your birth time in profile.',
      );
    }

    const dateOfBirth = new Date(user.dateOfBirth);
    const sign = this.zodiacService.calculateZodiacSign(dateOfBirth);
    const today = new Date().toISOString().split('T')[0];

    // Kiểm tra xem đã có user birth date chưa
    const existingBirthDate = await this.userBirthDateRepository.findOne({
      where: {
        userId: user.id,
        dateOfBirth: dateOfBirth,
      },
    });

    // Tạo hoặc cập nhật user birth date
    const userBirthDate = existingBirthDate || new UserBirthDate();
    if (!existingBirthDate) {
      userBirthDate.userId = user.id;
      userBirthDate.dateOfBirth = dateOfBirth;
      userBirthDate.zodiacSign = sign;
      await this.userBirthDateRepository.save(userBirthDate);
    }

    // Kiểm tra xem đã có horoscope cho ngày hôm nay chưa
    const existingHoroscope = await this.horoscopeHistoryRepository.findOne({
      where: {
        userId: user.id,
        userBirthDateId: userBirthDate.id,
        date: today,
      },
    });

    if (existingHoroscope) {
      this.logger.debug(
        `Found existing horoscope for user ${user.id} for today: ${today}`,
      );
      return existingHoroscope;
    }

    // Tạo horoscope mới cho ngày hôm nay
    const generatedHoroscope = await this.horoscopeGenerator.generateHoroscope({
      sign,
      dateOfBirth: dateOfBirth.toISOString().split('T')[0],
      birthTime: user.birthTime,
    });

    const horoscopeHistory = new HoroscopeHistory();
    horoscopeHistory.userId = user.id;
    horoscopeHistory.userBirthDateId = userBirthDate.id;
    horoscopeHistory.sign = generatedHoroscope.sign;
    horoscopeHistory.date = today;
    horoscopeHistory.scores = generatedHoroscope.scores;
    horoscopeHistory.overview = generatedHoroscope.overview;
    horoscopeHistory.loveAndRelationships =
      generatedHoroscope.loveAndRelationships;
    horoscopeHistory.careerAndStudies = generatedHoroscope.careerAndStudies;
    horoscopeHistory.healthAndWellbeing = generatedHoroscope.healthAndWellbeing;
    horoscopeHistory.moneyAndFinances = generatedHoroscope.moneyAndFinances;
    horoscopeHistory.isSave = false;

    await this.horoscopeHistoryRepository.save(horoscopeHistory);
    this.logger.log(
      `Generated and saved horoscope for user ${user.id} for today ${today}`,
    );
    return horoscopeHistory;
  }
}
