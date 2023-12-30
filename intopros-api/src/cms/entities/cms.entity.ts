import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity()
export class Cms extends BaseEntity {
  @ApiProperty({ type: 'number', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: 'date', example: '2022-05-22T06:42:19.463Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: 'date', example: '2022-05-22T06:42:19.463Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: 'string', example: 'First ever CMS page' })
  @Column({ type: 'text' })
  title: string;

  @ApiProperty({
    type: 'string',
    example: "This is the first ever CMS page's description",
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ type: 'string', example: 'first-ever-cms-page' })
  @Column({ type: 'text' })
  slug: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    example: '/uploads/first-ever-cms-page.png',
  })
  @Column({ nullable: true })
  image?: string;

  @ApiProperty({ type: 'boolean', example: true })
  @Column({ type: 'bool', default: false })
  isActive: boolean;

  /* SEO */
  @ApiProperty({
    type: 'string',
    example: 'This is the meta:description value for the page',
  })
  @Column({ type: 'text', nullable: true })
  metaDescription?: string;

  /* RELATIONS */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  createdBy: User;

  @ApiProperty({ type: 'number', example: 12 })
  @Column({ nullable: true })
  creatorId?: number;

  @ManyToOne(() => Cms, (cms) => cms.childPages)
  @JoinColumn({ name: 'parentPageId' })
  parentPage: Cms;

  @ApiProperty({ type: 'number', example: 123 })
  @Column({ nullable: true })
  parentPageId?: number;

  // @ApiProperty({ type: () => Cms, isArray: true })
  @OneToMany(() => Cms, (cms) => cms.parentPage, { cascade: true })
  childPages: Cms[];
}
