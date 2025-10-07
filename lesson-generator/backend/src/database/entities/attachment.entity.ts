import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('attachments')
export class AttachmentEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  mime_type: string;

  @Column()
  type: 'file' | 'image';

  @Column({ nullable: true })
  upload_url: string;

  @Column({ nullable: true })
  preview_url: string;

  @Column({ type: 'bigint', default: 0 })
  size: number;

  @CreateDateColumn()
  created_at: Date;
}