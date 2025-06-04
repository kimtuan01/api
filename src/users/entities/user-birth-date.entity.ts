import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ZodiacSign } from './zodiac-sign.enum';

@Entity('user_birth_dates')
export class UserBirthDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ZodiacSign,
    default: ZodiacSign.UNKNOWN,
  })
  zodiacSign: ZodiacSign;

  @CreateDateColumn()
  createdAt: Date;
}
