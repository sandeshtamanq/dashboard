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
import { Technologies } from './technologies.entity';

@Entity()
export class TechnologiesFAQ extends BaseEntity {

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
  question: string;

  @ApiProperty({ type: 'string', example: 'Node js' })
  @Column()
  technology: string;

  @ApiProperty({
    type: 'string',
    example: 'Body of the blog post with HTML tags',
  })
  @Column({ type: 'text' })
  answer: string;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(type => Technologies, (tech) => tech.faq, {
    onDelete: "CASCADE",
  })
  belongsTo: Technologies;

}
