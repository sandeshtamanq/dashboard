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

@Entity()
export class Testimonial extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  name: string;

  @Column()
  designation: string;

  @Column()
  image: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @ManyToOne(() => User)
  createdBy: User;
}
