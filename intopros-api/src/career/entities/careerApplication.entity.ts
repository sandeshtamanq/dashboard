import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import User from '../../users/entities/user.entity';
import { Career } from './career.entity';
import { Status } from '../dto/careerApplication.dto';

@Entity()
export default class Application extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'text' })
  coverLetter: string;

  @Column({ type: 'text' })
  file: string;

  @Column({ type: 'enum', enum: Status, default: Status.NEW })
  status: string;

  @Column({ nullable: true })
  remark: string;

  // CUSTOMS STUFFS
  @Column({ type: 'boolean', default: false })
  isResolved: boolean;

  @Column({ type: 'date', nullable: true })
  resolvedAt: Date;

  /**
   * RELATIONS
   */

  @ManyToOne(() => User, { nullable: true })
  resolvedBy?: User;

  @OneToOne((type) => Career, (career) => career.application)
  position: Career;
}
