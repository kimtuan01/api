import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ZodiacSign } from './zodiac-sign.enum';
import { ApiProperty } from '@nestjs/swagger';
import { UserPremium } from './user-premium.enum';

/**
 * User entity representing application users
 */
@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    maxLength: 100,
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    uniqueItems: true,
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'User password (hashed)',
    example: 'hashedPassword123',
    writeOnly: true,
  })
  @Column({ select: false })
  password: string;

  @ApiProperty({
    description: 'User gender',
    example: 'male',
    maxLength: 20,
    required: false,
    nullable: true,
  })
  @Column({ nullable: true, length: 20 })
  gender: string;

  @ApiProperty({
    description: 'User date of birth',
    example: '1990-01-01',
    required: false,
    nullable: true,
    type: Date,
  })
  @Column({ nullable: true, type: 'date' })
  dateOfBirth: Date;

  @ApiProperty({
    description: 'User birth time',
    example: '14:30:00',
    required: false,
    nullable: true,
  })
  @Column({ nullable: true, type: 'time' })
  birthTime: string;

  @ApiProperty({
    description: 'User latitude coordinate',
    example: 37.7749,
    required: false,
    nullable: true,
  })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @ApiProperty({
    description: 'User longitude coordinate',
    example: -122.4194,
    required: false,
    nullable: true,
  })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @ApiProperty({
    description: 'User full address',
    example: '123 Main St, San Francisco, CA 94105, USA',
    required: false,
    nullable: true,
    maxLength: 255,
  })
  @Column({ nullable: true, length: 255 })
  address: string;

  @ApiProperty({
    description: 'User timezone',
    example: 'America/Los_Angeles',
    required: false,
    nullable: true,
    maxLength: 50,
  })
  @Column({ nullable: true, length: 50 })
  timezone: string;

  @ApiProperty({
    description: 'User zodiac sign',
    enum: ZodiacSign,
    enumName: 'ZodiacSign',
    default: ZodiacSign.UNKNOWN,
    required: false,
    nullable: true,
  })
  @Column({
    nullable: true,
    type: 'enum',
    enum: ZodiacSign,
    default: ZodiacSign.UNKNOWN,
  })
  zodiacSign: ZodiacSign;

  @ApiProperty({
    description: 'Whether user has completed onboarding',
    example: false,
    default: false,
  })
  @Column({ default: false })
  onboardingCompleted: boolean;

  @ApiProperty({
    description: 'User premium status',
    enum: UserPremium,
    enumName: 'UserPremium',
    default: UserPremium.NONE,
  })
  @Column({ type: 'enum', enum: UserPremium, default: UserPremium.NONE })
  isPremium: UserPremium;

  @ApiProperty({
    description: 'Timestamp when the user was created',
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    type: Date,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Password reset token',
    example: 'reset-token-123',
    required: false,
    nullable: true,
  })
  @Column({ select: false, nullable: true })
  resetToken: string;

  @ApiProperty({
    description: 'Password reset token expiration',
    example: '2024-03-20T12:00:00Z',
    required: false,
    nullable: true,
  })
  @Column({ select: false, nullable: true })
  resetTokenExpires: Date;
}
