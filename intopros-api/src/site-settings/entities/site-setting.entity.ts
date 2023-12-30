import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SiteSetting extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn()
  updatedAt: Date;

  //for office 1
  @Column({ nullable: true })
  officeName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  //for office 2
  @Column({ nullable: true })
  officeName2: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true })
  phone2: string;

  @Column({ nullable: true })
  email2: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  linkedIn: string;

  @ApiProperty({ type: 'string', example: '/uploads/test.png' })
  @Column({ nullable: true })
  headerLogo: string;

  @ApiProperty({ type: 'string', example: '/uploads/test.png' })
  @Column({ nullable: true })
  footerLogo: string;
}
