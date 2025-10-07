import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LessonService } from '../services/lesson.service';
import { FicheStep } from '../types/lesson.types';

@Controller('api/lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async createLesson(
    @Body()
    data: {
      threadId: string;
      subject: string;
      lessonTitle: string;
      classe: string;
      domain?: string;
      areaOfLife?: string;
      previousLesson?: string;
      contentOutline?: string;
    },
  ) {
    return this.lessonService.createLesson(data);
  }

  @Get('thread/:threadId')
  async getLessonByThread(@Param('threadId') threadId: string) {
    return this.lessonService.getLessonByThreadId(threadId);
  }

  @Get(':lessonId/steps')
  async getLessonSteps(@Param('lessonId') lessonId: string) {
    return this.lessonService.getLessonSteps(lessonId);
  }

  @Post(':lessonId/steps/:stepSlug/generate')
  async generateStep(
    @Param('lessonId') lessonId: string,
    @Param('stepSlug') stepSlug: FicheStep,
  ) {
    return this.lessonService.generateStep(lessonId, stepSlug);
  }

  @Post(':lessonId/steps/:stepSlug/approve')
  async approveStep(
    @Param('lessonId') lessonId: string,
    @Param('stepSlug') stepSlug: FicheStep,
    @Body() feedback: any,
  ) {
    await this.lessonService.approveStep(lessonId, stepSlug, feedback);
    return { success: true };
  }

  @Post(':lessonId/steps/:stepSlug/reject')
  async rejectStep(
    @Param('lessonId') lessonId: string,
    @Param('stepSlug') stepSlug: FicheStep,
    @Body() feedback: any,
  ) {
    await this.lessonService.rejectStep(lessonId, stepSlug, feedback);
    return { success: true };
  }
}