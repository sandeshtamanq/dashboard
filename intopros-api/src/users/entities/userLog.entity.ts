import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import UserDetail from './userDetail.entity';

export enum UserLogActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

@Entity()
export default class UserLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: UserLogActionType,
    default: UserLogActionType.UPDATE,
  })
  action: UserLogActionType;

  @ManyToOne(() => UserDetail, (userDetails) => userDetails.logs)
  userDetail: UserDetail;

  @ManyToOne(() => User)
  performer: User;
}
