import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ThreadItemEntity } from './thread-item.entity';

@Entity('threads')
export class ThreadEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'jsonb', default: { type: 'active' } })
  status: {
    type: 'active' | 'locked' | 'closed';
    reason?: string;
  };

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @OneToMany(() => ThreadItemEntity, (item) => item.thread, { cascade: true })
  items: ThreadItemEntity[];
}