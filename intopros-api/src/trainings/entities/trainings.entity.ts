import { ApiProperty } from '@nestjs/swagger';
import {
  AfterLoad,
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
export class Training extends BaseEntity {
  @ApiProperty({ type: 'string', isArray: true, example: ['hello', 'world'] })
  public _tags: string[];

  @ApiProperty({ type: 'number', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: 'date', example: '2020-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: 'date', example: '2020-01-02T00:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: 'date', example: '2020-01-02T00:00:00.000Z' })
  @Column({ type: 'date', nullable: true })
  publishedDate: Date;

  @ApiProperty({ type: 'string', example: 'my-first-training-post' })
  @Column()
  slug: string;

  @ApiProperty({ type: 'string', example: 'My first training post' })
  @Column()
  title: string;

  @ApiProperty({
    type: 'string',
    example: 'Android Developer',
  })
  @Column({ type: 'text' })
  category: string;

  @ApiProperty({ type: 'string', example: 'hello,world' })
  @Column({ nullable: true })
  tags: string;

  @ApiProperty({
    type: 'string',
    example: 'Body of the training post with HTML tags',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ type: 'string', example: '/uploads/test.png' })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ type: 'boolean', example: true })
  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @ManyToOne(() => User)
  createdBy: User;

  /* SEO */
  @ApiProperty({
    type: 'string',
    example: 'This is the meta:description value for the training article',
  })
  @Column({ type: 'text', nullable: true })
  metaDescription?: string;

  @AfterLoad()
  private formatTagsAsString() {
    this._tags = this.tags ? this.tags.split(',') : [];
  }
}
