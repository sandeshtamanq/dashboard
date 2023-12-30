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
import { TechnologiesFAQ } from './technologiesFAQ.entity';
import { TechnologiesFramework } from './technologiesFramework.entity';

@Entity()
export class Technologies extends BaseEntity {

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
  shortDescription: string;

  @ApiProperty({
    type: 'string',
    example: 'Body of the blog post with HTML tags',
  })
  @Column({ type: 'text' })
  fullDescription: string;

  @ApiProperty({ type: 'string', example: '/uploads/test.png' })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ type: 'string', isArray: true, example: ['hello', 'world'] })
  public _techInfo: string[];

  @ManyToOne(() => User)
  createdBy: User;

  @OneToMany(type => TechnologiesFramework, (framework) => framework.belongsTo, 
  { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  framework: TechnologiesFramework;

  @OneToMany(type => TechnologiesFAQ, (faq) => faq.belongsTo, 
  { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  faq: TechnologiesFAQ;

}
