import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ThreadEntity } from './thread.entity';

@Entity('thread_items')
@Index(['thread_id', 'created_at'])
export class ThreadItemEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  thread_id: string;

  @Column()
  type: string;

  @Column({ type: 'jsonb' })
  data: any;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => ThreadEntity, (thread) => thread.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'thread_id' })
  thread: ThreadEntity;
}