import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import User from '../users/entities/user.entity';

@Entity()
export default class ApiLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  method: string;

  @Column()
  path: string;

  @Column({ type: 'text', nullable: true })
  queryParams?: string;

  @Column()
  source: string;

  @ManyToOne(() => User, (user) => user.apiLogs, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ type: 'int', nullable: true })
  userId?: number;
}
