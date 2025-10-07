import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lesson } from './Lesson.js';
import { LessonStep } from './LessonStep.js';

@Entity('agent_conversations')
export class AgentConversation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'lesson_id' })
  lessonId!: number;

  @Column({ name: 'step_id', nullable: true })
  stepId?: number;

  @Column({ type: 'varchar', length: 50 })
  role!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'vector', nullable: true, dimension: 1536 })
  embedding?: number[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Lesson, (lesson) => lesson.conversations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson!: Lesson;

  @ManyToOne(() => LessonStep, (step) => step.conversations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'step_id' })
  step?: LessonStep;
}