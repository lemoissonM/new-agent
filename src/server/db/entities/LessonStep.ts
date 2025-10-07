import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Lesson } from './Lesson.js';
import { AgentConversation } from './AgentConversation.js';

@Entity('lesson_steps')
export class LessonStep {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'lesson_id' })
  lessonId!: number;

  @Column({ name: 'step_name', type: 'varchar', length: 100 })
  stepName!: string;

  @Column({ name: 'step_type', type: 'varchar', length: 50 })
  stepType!: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ name: 'user_feedback', type: 'text', nullable: true })
  userFeedback?: string;

  @Column({ type: 'boolean', default: false })
  approved!: boolean;

  @Column({ name: 'agent_metadata', type: 'jsonb', nullable: true })
  agentMetadata?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Lesson, (lesson) => lesson.steps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson!: Lesson;

  @OneToMany(() => AgentConversation, (conversation) => conversation.step)
  conversations!: AgentConversation[];
}