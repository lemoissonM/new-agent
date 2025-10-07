import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { LessonEntity, LessonStepEntity } from '../../database/entities';
import { FicheStep, Fiche, PromptType, StepConfig } from '../types/lesson.types';
import { getSteps } from '../helpers/steps.config';
import { promptGenerators } from '../helpers/prompt.helper';

@Injectable()
export class LessonService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
    @InjectRepository(LessonStepEntity)
    private lessonStepRepository: Repository<LessonStepEntity>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async createLesson(data: {
    threadId: string;
    subject: string;
    lessonTitle: string;
    classe: string;
    domain?: string;
    areaOfLife?: string;
    previousLesson?: string;
    contentOutline?: string;
  }): Promise<LessonEntity> {
    const lesson = this.lessonRepository.create({
      thread_id: data.threadId,
      subject: data.subject,
      lesson_title: data.lessonTitle,
      classe: data.classe,
      domain: data.domain,
      area_of_life: data.areaOfLife,
      previous_lesson: data.previousLesson,
      content_outline: data.contentOutline,
      level: this.determineLevel(data.classe),
      current_step: FicheStep.Objectives,
      status: 'in_progress',
      step_data: {},
    });

    const savedLesson = await this.lessonRepository.save(lesson);

    // Initialize steps
    const steps = getSteps(data.classe);
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await this.lessonStepRepository.save({
        lesson_id: savedLesson.id,
        step_slug: step.slug,
        step_title: step.title,
        step_type: step.type,
        status: i === 0 ? 'generating' : 'pending',
        order: i,
      });
    }

    return savedLesson;
  }

  async getLessonByThreadId(threadId: string): Promise<LessonEntity | null> {
    return this.lessonRepository.findOne({
      where: { thread_id: threadId },
    });
  }

  async generateStep(
    lessonId: string,
    stepSlug: FicheStep,
  ): Promise<{ content: string; stepData: Record<string, any> }> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error(`Lesson ${lessonId} not found`);
    }

    const step = await this.lessonStepRepository.findOne({
      where: { lesson_id: lessonId, step_slug: stepSlug },
    });

    if (!step) {
      throw new Error(`Step ${stepSlug} not found for lesson ${lessonId}`);
    }

    // Update step status
    step.status = 'generating';
    await this.lessonStepRepository.save(step);

    // Build fiche data from lesson and previous steps
    const fiche: Fiche = {
      subject: lesson.subject,
      lessonTitle: lesson.lesson_title,
      classe: lesson.classe,
      domain: lesson.domain,
      areaOfLife: lesson.area_of_life,
      previousLesson: lesson.previous_lesson,
      contentOutline: lesson.content_outline,
      ...lesson.step_data,
    };

    // Get prompt for this step
    const promptGenerator = promptGenerators[stepSlug];
    if (!promptGenerator) {
      throw new Error(`No prompt generator found for step ${stepSlug}`);
    }

    const prompt = promptGenerator(fiche);
    
    // Generate content using OpenAI
    const content = await this.generateContent(prompt);

    // Update step with generated content
    step.content = content;
    step.status = 'pending_approval';
    await this.lessonStepRepository.save(step);

    // Update lesson step_data
    const stepDataKey = this.getStepDataKey(stepSlug);
    lesson.step_data[stepDataKey] = content;
    await this.lessonRepository.save(lesson);

    return { content, stepData: lesson.step_data };
  }

  async approveStep(
    lessonId: string,
    stepSlug: FicheStep,
    userFeedback?: any,
  ): Promise<void> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error(`Lesson ${lessonId} not found`);
    }

    const step = await this.lessonStepRepository.findOne({
      where: { lesson_id: lessonId, step_slug: stepSlug },
    });

    if (!step) {
      throw new Error(`Step ${stepSlug} not found`);
    }

    step.status = 'approved';
    step.user_feedback = userFeedback;
    await this.lessonStepRepository.save(step);

    // Move to next step
    const steps = getSteps(lesson.classe);
    const currentIndex = steps.findIndex((s) => s.slug === stepSlug);
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      lesson.current_step = nextStep.slug;
      await this.lessonRepository.save(lesson);

      // Mark next step as ready to generate
      const nextStepEntity = await this.lessonStepRepository.findOne({
        where: { lesson_id: lessonId, step_slug: nextStep.slug },
      });
      if (nextStepEntity) {
        nextStepEntity.status = 'generating';
        await this.lessonStepRepository.save(nextStepEntity);
      }
    } else {
      // All steps completed
      lesson.status = 'completed';
      await this.lessonRepository.save(lesson);
    }
  }

  async rejectStep(
    lessonId: string,
    stepSlug: FicheStep,
    feedback: any,
  ): Promise<void> {
    const step = await this.lessonStepRepository.findOne({
      where: { lesson_id: lessonId, step_slug: stepSlug },
    });

    if (!step) {
      throw new Error(`Step ${stepSlug} not found`);
    }

    step.status = 'rejected';
    step.user_feedback = feedback;
    await this.lessonStepRepository.save(step);
  }

  private async generateContent(prompt: PromptType): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt.systemPrompt },
        { role: 'user', content: prompt.userPrompt },
        ...(prompt.assistant ? [{ role: 'assistant' as const, content: prompt.assistant }] : []),
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  }

  private determineLevel(classe: string): 'maternelle' | 'primaire' | 'secondaire' {
    const classeNum = parseInt(classe, 10);
    if (classeNum < 7) return 'primaire';
    if (classeNum < 13) return 'secondaire';
    return 'maternelle';
  }

  private getStepDataKey(stepSlug: FicheStep): string {
    // Convert FicheStep enum to camelCase key
    return stepSlug.charAt(0).toLowerCase() + stepSlug.slice(1);
  }

  async getLessonSteps(lessonId: string): Promise<LessonStepEntity[]> {
    return this.lessonStepRepository.find({
      where: { lesson_id: lessonId },
      order: { order: 'ASC' },
    });
  }
}