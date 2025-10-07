import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LessonStep } from './LessonStep.js';
import { AgentConversation } from './AgentConversation.js';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 100 })
  subject!: string;

  @Column({ type: 'varchar', length: 50 })
  classe!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  domain?: string;

  @Column({ name: 'area_of_life', type: 'varchar', length: 100, nullable: true })
  areaOfLife?: string;

  @Column({ name: 'previous_lesson', type: 'text', nullable: true })
  previousLesson?: string;

  @Column({ name: 'content_outline', type: 'text', nullable: true })
  contentOutline?: string;

  @Column({ type: 'varchar', length: 50, default: 'draft' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => LessonStep, (step) => step.lesson)
  steps!: LessonStep[];

  @OneToMany(() => AgentConversation, (conversation) => conversation.lesson)
  conversations!: AgentConversation[];
}