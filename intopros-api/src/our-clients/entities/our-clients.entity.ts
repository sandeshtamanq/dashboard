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
export class OurClient extends BaseEntity {

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
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'Founder',
  })
  @Column({ type: 'text' })
  designation: string;

  @ApiProperty({ type: 'boolean', example: true })
  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @ApiProperty({
    type: 'string',
    example: 'linkedin.com',
  })
  @Column({ type: 'text' })
  linkedin: string;


  @ApiProperty({ type: 'string', example: '/uploads/test.png' })
  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User)
  createdBy: User;

}
