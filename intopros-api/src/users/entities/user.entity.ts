import { ApiHideProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  BaseEntity,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import ApiLog from '../../@entities/apiLog.entity';
import UserDetail from './userDetail.entity';

export enum UserRole {
  ADMIN = 'admin',
  SUPPORT = 'support',
  USER = 'user',
  COMPANY = 'company',
}

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  // Special column
  @Column({ type: 'datetime', nullable: true })
  lastActiveDate?: Date;

  /**
   * RELATIONS
   */
  @OneToOne(() => UserDetail, (details) => details.user, {
    cascade: ['remove', 'soft-remove', 'recover'],
  })
  @JoinColumn()
  details: UserDetail;

  @OneToMany(() => ApiLog, (apiLog) => apiLog.user)
  apiLogs: ApiLog[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  createdBy: User;

  @Column({ nullable: true })
  creatorId?: number;
}
