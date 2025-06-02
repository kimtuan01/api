import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthControllerV1 } from './health.controller';

@Module({
  imports: [TypeOrmModule],
  controllers: [HealthControllerV1],
})
export class HealthModule {}
