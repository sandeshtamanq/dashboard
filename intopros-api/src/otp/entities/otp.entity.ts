import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from '../../users/entities/user.entity';

export enum OtpType {
  PASSWORD_RESET = 'passwordReset',
  VERIFY_EMAIL = 'verifyEmail',
}

@Entity()
export default class Otp extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  code: string;

  @Column({ type: 'enum', enum: OtpType, default: OtpType.PASSWORD_RESET })
  type: OtpType;

  @ManyToOne(() => User)
  user: User;
}
