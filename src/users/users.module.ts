import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ZodiacService } from './services/zodiac.service';
import { OnboardingController } from './onboarding.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule],
  controllers: [UsersController, OnboardingController],
  providers: [UsersService, ZodiacService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
