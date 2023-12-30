import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  import User from '../../users/entities/user.entity';
import { TechnologiesHiringMenu } from './technologiesHiringMenu.entity';
  
  @Entity()
  export default class HiringApplication extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column()
    name: string;
  
    @Column()
    email: string;
  
    @Column()
    tech: string;
  
    @Column()
    budget: string;
  
    @Column({ type: 'text' })
    message: string;
  
    @Column({ nullable: true })
    file: string;
  
    // CUSTOMS STUFFS
    @Column({ type: 'boolean', default: false })
    isResolved: boolean;
  
    @Column({ type: 'date', nullable: true })
    resolvedAt: Date;
  
    /**
     * RELATIONS
     */
  
    @ManyToOne(() => User, { nullable: true })
    resolvedBy?: User;

    @OneToOne(() => TechnologiesHiringMenu, (application) => application.application)
    package: TechnologiesHiringMenu;
  }
  