import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import User from '../../users/entities/user.entity';
import HiringApplication from './technologiesHiringApplication.entity';

@Entity()
export class TechnologiesHiringMenu extends BaseEntity {

  @ApiProperty({ type: 'number', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: 'date', example: '2020-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: 'date', example: '2020-01-02T00:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: 'string', example: 'my-first-blog-post' })
  @Column()
  slug: string;

  @ApiProperty({ type: 'string', example: 'My first blog post' })
  @Column()
  title: string;

  @ApiProperty({
    type: 'string',
    example: 'Body of the blog post with HTML tags',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ type: 'string', example: 'My first blog post' })
  @Column()
  working: string;

  @ApiProperty({ type: 'string', example: 'My first blog post' })
  @Column()
  communication: string;

  @ApiProperty({ type: 'string', example: 'My first blog post' })
  @Column()
  billing: string;

  @ManyToOne(() => User)
  createdBy: User;

  @OneToOne(type => HiringApplication, (application) => application.package, {
    onDelete: 'SET NULL'
  })
  @JoinColumn()
  application: HiringApplication;

}
