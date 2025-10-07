import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('lessons')
@Index(['thread_id'])
export class LessonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  thread_id: string;

  @Column()
  subject: string;

  @Column()
  lesson_title: string;

  @Column()
  classe: string;

  @Column({ nullable: true })
  domain: string;

  @Column({ nullable: true })
  area_of_life: string;

  @Column({ nullable: true })
  previous_lesson: string;

  @Column({ nullable: true })
  content_outline: string;

  @Column({ default: 'maternelle' })
  level: 'maternelle' | 'primaire' | 'secondaire';

  @Column({ type: 'jsonb', default: {} })
  step_data: Record<string, any>;

  @Column({ default: 'objectives' })
  current_step: string;

  @Column({ default: 'in_progress' })
  status: 'in_progress' | 'completed' | 'cancelled';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}