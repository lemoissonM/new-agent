import OpenAI from 'openai';
import { Fiche, FicheStep, StepExecutionResult } from '../types/fiche.types';
import { getPrompt, getSteps } from '../utils/prompts';

export class LessonAgent {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async executeStep(fiche: Fiche, step: FicheStep, userFeedback?: string): Promise<StepExecutionResult> {
    try {
      const promptGenerator = getPrompt(fiche);
      const promptFunction = promptGenerator[step];

      if (!promptFunction) {
        throw new Error(`No prompt generator found for step: ${step}`);
      }

      const { systemPrompt, userPrompt, assistant } = promptFunction(fiche);

      console.log(`Executing step: ${step}`);
      console.log('System:', systemPrompt.substring(0, 100) + '...');
      console.log('User:', userPrompt.substring(0, 100) + '...');

      // Build messages array
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      // Add user feedback if provided
      if (userFeedback) {
        messages.push({
          role: 'user',
          content: `User feedback: ${userFeedback}. Please adjust your response accordingly.`,
        });
      }

      // Add assistant prompt if exists
      if (assistant) {
        messages.push({ role: 'assistant', content: assistant });
      }

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content || '';
      const fullContent = assistant ? assistant + content : content;

      return {
        step,
        content: fullContent.trim(),
        status: 'pending_approval',
      };
    } catch (error) {
      console.error(`Error executing step ${step}:`, error);
      return {
        step,
        content: '',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async executeAllSteps(
    fiche: Fiche,
    onStepComplete?: (step: FicheStep, result: StepExecutionResult) => Promise<boolean>
  ): Promise<Fiche> {
    const steps = getSteps(fiche);
    const updatedFiche = { ...fiche };

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      console.log(`\n=== Processing Step ${i + 1}/${steps.length}: ${step.title} (${step.slug}) ===`);

      // Execute the step
      const result = await this.executeStep(updatedFiche, step.slug);

      // If there's a callback, wait for approval
      if (onStepComplete) {
        const approved = await onStepComplete(step.slug, result);
        if (!approved) {
          console.log(`Step ${step.slug} not approved, stopping execution`);
          break;
        }
      }

      // Update the fiche with the result
      if (result.status !== 'error') {
        this.updateFicheWithStepResult(updatedFiche, step.slug, result.content);
      }
    }

    return updatedFiche;
  }

  private updateFicheWithStepResult(fiche: Fiche, step: FicheStep, content: string): void {
    // Map step to fiche property
    const stepToPropertyMap: Record<FicheStep, keyof Fiche> = {
      [FicheStep.Objectives]: 'objectives',
      [FicheStep.RevisionTeacher]: 'revisionTeacher',
      [FicheStep.RevisionStudent]: 'revisionStudent',
      [FicheStep.Situation]: 'situation',
      [FicheStep.ActivitePrincipaleTeacher]: 'activitePrincipaleTeacher',
      [FicheStep.ActivitePrincipaleStudent]: 'activitePrincipaleStudent',
      [FicheStep.SyntheseTeacher]: 'syntheseTeacher',
      [FicheStep.SyntheseStudent]: 'syntheseStudent',
      [FicheStep.Exercice]: 'exercice',
      [FicheStep.SituationSimilaires]: 'situationSimilaire',
      [FicheStep.RevisionTeacherRappel]: 'revisionTeacherRappel',
      [FicheStep.RevisionStudentRappel]: 'revisionStudentRappel',
      [FicheStep.RevisionTeacherMotivation]: 'revisionTeacherMotivation',
      [FicheStep.RevisionStudentMotivation]: 'revisionStudentMotivation',
      [FicheStep.ResumeTeacher]: 'syntheseTeacher',
      [FicheStep.ResumeStudent]: 'syntheseStudent',
      [FicheStep.ActiviteControleApplicationTeacher]: 'activiteControleApplicationTeacher',
      [FicheStep.ActiviteControleApplicationStudent]: 'activiteControleApplicationStudent',
      [FicheStep.ActiviteControleResearchTeacher]: 'activiteControleResearchTeacher',
      [FicheStep.ActiviteControleResearchStudent]: 'activiteControleResearchStudent',
      [FicheStep.ActiviteControleEvaluationTeacher]: 'activiteControleEvaluationTeacher',
      [FicheStep.ActiviteControleEvaluationStudent]: 'activiteControleEvaluationStudent',
    };

    const property = stepToPropertyMap[step];
    if (property) {
      (fiche as any)[property] = content;
    }
  }
}

export function createLessonAgent(apiKey?: string): LessonAgent {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('OpenAI API key is required');
  }
  return new LessonAgent(key);
}