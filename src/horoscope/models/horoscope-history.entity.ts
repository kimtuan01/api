import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserBirthDate } from '../../users/entities/user-birth-date.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('horoscope_history')
export class HoroscopeHistory {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the horoscope entry',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'ID of the user who owns the horoscope',
  })
  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174002',
    description: 'ID of the user birth date record',
    nullable: true,
  })
  @Column({ type: 'uuid', nullable: true })
  userBirthDateId: string;

  @ManyToOne(() => UserBirthDate, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'userBirthDateId' })
  userBirthDate: UserBirthDate;

  @ApiProperty({
    example: 'Capricorn',
    description: 'Zodiac sign for the horoscope',
  })
  @Column()
  sign: string;

  @ApiProperty({
    example: '2024-03-20',
    description: 'Date of the horoscope',
  })
  @Column()
  date: string;

  @ApiProperty({
    example: {
      health: 85,
      love: 70,
      career: 90,
    },
    description: 'Numerical scores for different aspects of life',
  })
  @Column('jsonb')
  scores: {
    health: number;
    love: number;
    career: number;
  };

  @ApiProperty({
    example: 'Today brings a mix of challenges and opportunities. Your determination will help you overcome obstacles.',
    description: 'General overview of the day',
  })
  @Column('text')
  overview: string;

  @ApiProperty({
    example: 'Focus on open communication in your relationships. Single individuals may find new connections.',
    description: 'Love and relationships forecast',
  })
  @Column('text')
  loveAndRelationships: string;

  @ApiProperty({
    example: 'A productive day for career advancement. Consider taking on new responsibilities.',
    description: 'Career and studies forecast',
  })
  @Column('text')
  careerAndStudies: string;

  @ApiProperty({
    example: 'Pay attention to your physical well-being. Regular exercise will boost your energy levels.',
    description: 'Health and wellbeing forecast',
  })
  @Column('text')
  healthAndWellbeing: string;

  @ApiProperty({
    example: 'Financial opportunities may arise. Be cautious with investments.',
    description: 'Money and finances forecast',
  })
  @Column('text')
  moneyAndFinances: string;

  @ApiProperty({
    example: true,
    description: 'Whether the horoscope is saved by the user',
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isSave: boolean;

  @ApiProperty({
    example: '2024-03-20T10:00:00.000Z',
    description: 'Timestamp when the horoscope was created',
  })
  @CreateDateColumn()
  createdAt: Date;
}
