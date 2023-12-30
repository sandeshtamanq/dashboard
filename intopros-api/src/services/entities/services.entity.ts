import { ApiProperty } from '@nestjs/swagger';
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
export class Services extends BaseEntity {

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

  @ApiProperty({ type: 'string', example: 'hello,world' })
  @Column({ nullable: true })
  tags: string;

  @ApiProperty({ type: 'boolean', example: true })
  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @ApiProperty({
    type: 'string',
    example: 'Body of the blog post with HTML tags',
  })
  @Column({ type: 'text' })
  shortDescription: string;

  @ApiProperty({
    type: 'string',
    example: 'Body of the blog post with HTML tags',
  })
  @Column({ type: 'text' })
  description: string;


  @ApiProperty({ type: 'string', example: '/uploads/test.png' })
  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User)
  createdBy: User;

}
