import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LessonEntity } from './lesson.entity';

@Entity('lesson_steps')
@Index(['lesson_id', 'step_slug'])
export class LessonStepEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lesson_id: string;

  @Column()
  step_slug: string;

  @Column()
  step_title: string;

  @Column()
  step_type: 'teacher' | 'student' | 'general';

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'generating' | 'pending_approval' | 'approved' | 'rejected';

  @Column({ type: 'jsonb', nullable: true })
  user_feedback: any;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => LessonEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: LessonEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}