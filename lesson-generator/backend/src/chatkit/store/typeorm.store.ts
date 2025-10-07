import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  ThreadEntity,
  ThreadItemEntity,
  AttachmentEntity,
} from '../../database/entities';
import {
  ThreadMetadata,
  ThreadItem,
  Attachment,
  Page,
} from '../types';

export type StoreItemType =
  | 'thread'
  | 'message'
  | 'tool_call'
  | 'task'
  | 'workflow'
  | 'attachment';

const ID_PREFIXES: Record<StoreItemType, string> = {
  thread: 'thr',
  message: 'msg',
  tool_call: 'tc',
  workflow: 'wf',
  task: 'tsk',
  attachment: 'atc',
};

@Injectable()
export class TypeORMStore<TContext = any> {
  constructor(
    @InjectRepository(ThreadEntity)
    private threadRepository: Repository<ThreadEntity>,
    @InjectRepository(ThreadItemEntity)
    private threadItemRepository: Repository<ThreadItemEntity>,
    @InjectRepository(AttachmentEntity)
    private attachmentRepository: Repository<AttachmentEntity>,
  ) {}

  generateThreadId(context: TContext): string {
    return this.generateId('thread');
  }

  generateItemId(
    itemType: StoreItemType,
    thread: ThreadMetadata,
    context: TContext,
  ): string {
    return this.generateId(itemType);
  }

  private generateId(itemType: StoreItemType): string {
    const prefix = ID_PREFIXES[itemType];
    return `${prefix}_${uuidv4().replace(/-/g, '').substring(0, 8)}`;
  }

  async loadThread(threadId: string, context: TContext): Promise<ThreadMetadata> {
    const thread = await this.threadRepository.findOne({
      where: { id: threadId },
    });

    if (!thread) {
      throw new Error(`Thread ${threadId} not found`);
    }

    return {
      id: thread.id,
      title: thread.title,
      created_at: thread.created_at,
      status: thread.status,
      metadata: thread.metadata,
    };
  }

  async saveThread(thread: ThreadMetadata, context: TContext): Promise<void> {
    await this.threadRepository.save({
      id: thread.id,
      title: thread.title,
      created_at: thread.created_at,
      status: thread.status,
      metadata: thread.metadata,
    });
  }

  async loadThreadItems(
    threadId: string,
    after: string | null,
    limit: number,
    order: string,
    context: TContext,
  ): Promise<Page<ThreadItem>> {
    const qb = this.threadItemRepository
      .createQueryBuilder('item')
      .where('item.thread_id = :threadId', { threadId })
      .orderBy('item.created_at', order === 'desc' ? 'DESC' : 'ASC')
      .limit(limit + 1);

    if (after) {
      const afterItem = await this.threadItemRepository.findOne({
        where: { id: after },
      });
      if (afterItem) {
        qb.andWhere(
          order === 'desc'
            ? 'item.created_at < :afterDate'
            : 'item.created_at > :afterDate',
          { afterDate: afterItem.created_at },
        );
      }
    }

    const items = await qb.getMany();
    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;

    return {
      data: data.map((item) => this.deserializeThreadItem(item)),
      has_more: hasMore,
      after: hasMore ? data[data.length - 1].id : null,
    };
  }

  async addThreadItem(
    threadId: string,
    item: ThreadItem,
    context: TContext,
  ): Promise<void> {
    await this.threadItemRepository.save({
      id: item.id,
      thread_id: threadId,
      type: item.type,
      data: item,
      created_at: item.created_at,
    });
  }

  async saveItem(
    threadId: string,
    item: ThreadItem,
    context: TContext,
  ): Promise<void> {
    await this.threadItemRepository.save({
      id: item.id,
      thread_id: threadId,
      type: item.type,
      data: item,
      created_at: item.created_at,
    });
  }

  async loadItem(
    threadId: string,
    itemId: string,
    context: TContext,
  ): Promise<ThreadItem> {
    const item = await this.threadItemRepository.findOne({
      where: { id: itemId, thread_id: threadId },
    });

    if (!item) {
      throw new Error(`Item ${itemId} not found in thread ${threadId}`);
    }

    return this.deserializeThreadItem(item);
  }

  async deleteThread(threadId: string, context: TContext): Promise<void> {
    await this.threadRepository.delete({ id: threadId });
  }

  async deleteThreadItem(
    threadId: string,
    itemId: string,
    context: TContext,
  ): Promise<void> {
    await this.threadItemRepository.delete({ id: itemId, thread_id: threadId });
  }

  async loadThreads(
    limit: number,
    after: string | null,
    order: string,
    context: TContext,
  ): Promise<Page<ThreadMetadata>> {
    const qb = this.threadRepository
      .createQueryBuilder('thread')
      .orderBy('thread.created_at', order === 'desc' ? 'DESC' : 'ASC')
      .limit(limit + 1);

    if (after) {
      const afterThread = await this.threadRepository.findOne({
        where: { id: after },
      });
      if (afterThread) {
        qb.andWhere(
          order === 'desc'
            ? 'thread.created_at < :afterDate'
            : 'thread.created_at > :afterDate',
          { afterDate: afterThread.created_at },
        );
      }
    }

    const threads = await qb.getMany();
    const hasMore = threads.length > limit;
    const data = hasMore ? threads.slice(0, limit) : threads;

    return {
      data: data.map((thread) => ({
        id: thread.id,
        title: thread.title,
        created_at: thread.created_at,
        status: thread.status,
        metadata: thread.metadata,
      })),
      has_more: hasMore,
      after: hasMore ? data[data.length - 1].id : null,
    };
  }

  async saveAttachment(attachment: Attachment, context: TContext): Promise<void> {
    await this.attachmentRepository.save({
      id: attachment.id,
      name: attachment.name,
      mime_type: attachment.mime_type,
      type: attachment.type,
      upload_url: attachment.upload_url,
      preview_url: attachment.preview_url,
    });
  }

  async loadAttachment(
    attachmentId: string,
    context: TContext,
  ): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id: attachmentId },
    });

    if (!attachment) {
      throw new Error(`Attachment ${attachmentId} not found`);
    }

    return {
      id: attachment.id,
      name: attachment.name,
      mime_type: attachment.mime_type,
      type: attachment.type,
      upload_url: attachment.upload_url,
      preview_url: attachment.preview_url,
    };
  }

  async deleteAttachment(
    attachmentId: string,
    context: TContext,
  ): Promise<void> {
    await this.attachmentRepository.delete({ id: attachmentId });
  }

  private deserializeThreadItem(entity: ThreadItemEntity): ThreadItem {
    return {
      ...entity.data,
      id: entity.id,
      thread_id: entity.thread_id,
      created_at: entity.created_at,
      type: entity.type,
    } as ThreadItem;
  }
}