import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  BaseEntity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import User from './user.entity';
import UserLog from './userLog.entity';


@Entity()
export default class UserDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /* GENERAL DETAILS */
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isBlocked: boolean;

  @Column({ type: 'integer', default: 0 })
  profileCompleteness: number;

  /* VERIFICATION STATUS */
  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isMobileVerified: boolean;

  // This one is set by admin
  @Column({ default: false })
  isProfileVerified: boolean;

  @Column({ nullable: true })
  verificationRemark?: string;

  /**
   * RELATIONS
   */
  @OneToOne(() => User, (user) => user.details)
  user: User;




  @OneToMany(() => UserLog, (userLog) => userLog.userDetail, { cascade: true })
  logs: UserLog[];
}
