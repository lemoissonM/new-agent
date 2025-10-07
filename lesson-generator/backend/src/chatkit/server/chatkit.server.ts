import { Injectable } from '@nestjs/common';
import { ThreadMetadata, UserMessageItem, ThreadStreamEvent } from '../types';
import { LessonService } from '../../lesson/services/lesson.service';
import { TypeORMStore } from '../store/typeorm.store';
import { FicheStep } from '../../lesson/types/lesson.types';

@Injectable()
export class ChatKitServer {
  constructor(
    private readonly store: TypeORMStore,
    private readonly lessonService: LessonService,
  ) {}

  async *respond(
    thread: ThreadMetadata,
    inputUserMessage: UserMessageItem | null,
    context: any,
  ): AsyncGenerator<ThreadStreamEvent> {
    if (!inputUserMessage) {
      return;
    }

    // Extract user message text
    const userText = inputUserMessage.content
      .filter((c) => c.type === 'input_text')
      .map((c) => (c.type === 'input_text' ? c.text : ''))
      .join(' ');

    // Check if there's an existing lesson for this thread
    let lesson = await this.lessonService.getLessonByThreadId(thread.id);

    if (!lesson) {
      // Parse lesson creation request
      const lessonData = this.parseLessonCreationRequest(userText);
      
      if (lessonData) {
        lesson = await this.lessonService.createLesson({
          threadId: thread.id,
          ...lessonData,
        });

        yield {
          type: 'progress_update',
          text: `Creating lesson plan for "${lessonData.lessonTitle}" in ${lessonData.subject}...`,
          icon: 'book-open',
        };

        // Start generating the first step
        const result = await this.lessonService.generateStep(
          lesson.id,
          FicheStep.Objectives,
        );

        yield {
          type: 'thread.item.done',
          item: {
            id: this.store.generateItemId('message', thread, context),
            thread_id: thread.id,
            type: 'assistant_message',
            content: [
              {
                type: 'output_text',
                text: `**Objectifs**\n\n${result.content}\n\n---\n\n*Please review and approve or provide feedback.*`,
                annotations: [],
              },
            ],
            created_at: new Date(),
          },
        };
      } else {
        // Send help message
        yield {
          type: 'thread.item.done',
          item: {
            id: this.store.generateItemId('message', thread, context),
            thread_id: thread.id,
            type: 'assistant_message',
            content: [
              {
                type: 'output_text',
                text: this.getHelpMessage(),
                annotations: [],
              },
            ],
            created_at: new Date(),
          },
        };
      }
    } else {
      // Handle step approval/rejection/feedback
      const command = this.parseUserCommand(userText);

      if (command.type === 'approve') {
        await this.lessonService.approveStep(
          lesson.id,
          lesson.current_step as FicheStep,
          command.feedback,
        );

        // Reload lesson to get updated current_step
        lesson = await this.lessonService.getLessonByThreadId(thread.id);

        if (lesson.status === 'completed') {
          yield {
            type: 'thread.item.done',
            item: {
              id: this.store.generateItemId('message', thread, context),
              thread_id: thread.id,
              type: 'assistant_message',
              content: [
                {
                  type: 'output_text',
                  text: '🎉 Lesson plan completed! All steps have been approved.',
                  annotations: [],
                },
              ],
              created_at: new Date(),
            },
          };
        } else {
          // Generate next step
          yield {
            type: 'progress_update',
            text: `Generating ${lesson.current_step}...`,
            icon: 'sparkle',
          };

          const result = await this.lessonService.generateStep(
            lesson.id,
            lesson.current_step as FicheStep,
          );

          const steps = await this.lessonService.getLessonSteps(lesson.id);
          const currentStep = steps.find(
            (s) => s.step_slug === lesson.current_step,
          );

          yield {
            type: 'thread.item.done',
            item: {
              id: this.store.generateItemId('message', thread, context),
              thread_id: thread.id,
              type: 'assistant_message',
              content: [
                {
                  type: 'output_text',
                  text: `**${currentStep?.step_title}**\n\n${result.content}\n\n---\n\n*Please review and approve or provide feedback.*`,
                  annotations: [],
                },
              ],
              created_at: new Date(),
            },
          };
        }
      } else if (command.type === 'reject') {
        await this.lessonService.rejectStep(
          lesson.id,
          lesson.current_step as FicheStep,
          command.feedback,
        );

        yield {
          type: 'thread.item.done',
          item: {
            id: this.store.generateItemId('message', thread, context),
            thread_id: thread.id,
            type: 'assistant_message',
            content: [
              {
                type: 'output_text',
                text: 'Step rejected. Please provide more details on what you\'d like changed, and I\'ll regenerate it.',
                annotations: [],
              },
            ],
            created_at: new Date(),
          },
        };
      } else if (command.type === 'regenerate') {
        yield {
          type: 'progress_update',
          text: `Regenerating ${lesson.current_step}...`,
          icon: 'sparkle',
        };

        const result = await this.lessonService.generateStep(
          lesson.id,
          lesson.current_step as FicheStep,
        );

        const steps = await this.lessonService.getLessonSteps(lesson.id);
        const currentStep = steps.find(
          (s) => s.step_slug === lesson.current_step,
        );

        yield {
          type: 'thread.item.done',
          item: {
            id: this.store.generateItemId('message', thread, context),
            thread_id: thread.id,
            type: 'assistant_message',
            content: [
              {
                type: 'output_text',
                text: `**${currentStep?.step_title} (Regenerated)**\n\n${result.content}\n\n---\n\n*Please review and approve or provide feedback.*`,
                annotations: [],
              },
            ],
            created_at: new Date(),
          },
        };
      }
    }
  }

  private parseLessonCreationRequest(text: string): {
    subject: string;
    lessonTitle: string;
    classe: string;
    domain?: string;
    areaOfLife?: string;
    previousLesson?: string;
    contentOutline?: string;
  } | null {
    // Simple parsing - in production, you'd use more sophisticated NLP
    const subjectMatch = text.match(/subject[:\s]+([^,\n]+)/i);
    const titleMatch = text.match(/lesson[:\s]+([^,\n]+)/i);
    const classeMatch = text.match(/class[e]?[:\s]+(\d+)/i);

    if (subjectMatch && titleMatch && classeMatch) {
      return {
        subject: subjectMatch[1].trim(),
        lessonTitle: titleMatch[1].trim(),
        classe: classeMatch[1].trim(),
        domain: text.match(/domain[:\s]+([^,\n]+)/i)?.[1]?.trim(),
        areaOfLife: text.match(/area[:\s]+([^,\n]+)/i)?.[1]?.trim(),
        previousLesson: text.match(/previous[:\s]+([^,\n]+)/i)?.[1]?.trim(),
      };
    }

    return null;
  }

  private parseUserCommand(text: string): {
    type: 'approve' | 'reject' | 'regenerate' | 'unknown';
    feedback?: string;
  } {
    const lowerText = text.toLowerCase().trim();

    if (
      lowerText.includes('approve') ||
      lowerText.includes('looks good') ||
      lowerText.includes('yes') ||
      lowerText.includes('continue')
    ) {
      return { type: 'approve', feedback: text };
    }

    if (
      lowerText.includes('reject') ||
      lowerText.includes('no') ||
      lowerText.includes('change')
    ) {
      return { type: 'reject', feedback: text };
    }

    if (lowerText.includes('regenerate') || lowerText.includes('try again')) {
      return { type: 'regenerate' };
    }

    return { type: 'unknown' };
  }

  private getHelpMessage(): string {
    return `# Welcome to AI Lesson Generator! 📚

To create a new lesson, provide the following information:

**Example:**
\`\`\`
Subject: Mathematics
Lesson: Introduction to Fractions
Class: 5
Domain: Arithmetic
Area: Daily life measurements
Previous lesson: Basic division
\`\`\`

Once I generate each step, you can:
- Type **"approve"** or **"looks good"** to move to the next step
- Type **"reject"** with feedback to have me regenerate
- Type **"regenerate"** to try again with the same parameters

Let's create an amazing lesson plan together!`;
  }
}