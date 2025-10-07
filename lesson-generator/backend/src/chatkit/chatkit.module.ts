import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadEntity, ThreadItemEntity, AttachmentEntity } from '../database/entities';
import { TypeORMStore } from './store/typeorm.store';
import { ChatKitServer } from './server/chatkit.server';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThreadEntity, ThreadItemEntity, AttachmentEntity]),
    LessonModule,
  ],
  providers: [TypeORMStore, ChatKitServer],
  exports: [TypeORMStore, ChatKitServer],
})
export class ChatKitModule {}