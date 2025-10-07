import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonEntity, LessonStepEntity } from '../database/entities';
import { LessonService } from './services/lesson.service';
import { LessonController } from './controllers/lesson.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity, LessonStepEntity])],
  providers: [LessonService],
  controllers: [LessonController],
  exports: [LessonService],
})
export class LessonModule {}