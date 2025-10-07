import OpenAI from 'openai';
import { Fiche, FicheStep, PromptType } from '../../src/types/fiche.types';
import { getPromptGenerator } from '../../src/prompts/promptGenerators';
import { getSteps } from '../../src/config/steps';
import pool from '../database/db';

export interface AgentResult {
  step: FicheStep;
  content: string;
  success: boolean;
  error?: string;
}

export interface StepApproval {
  approved: boolean;
  userFeedback?: string;
}

export class LessonAgent {
  private openai: OpenAI;
  private model: string = 'gpt-4-turbo-preview';

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Generate content for a specific step
   */
  async generateStep(fiche: Fiche, step: FicheStep): Promise<AgentResult> {
    try {
      const promptGenerator = getPromptGenerator(fiche.classe);
      const promptFunc = promptGenerator[step];

      if (!promptFunc) {
        return {
          step,
          content: '',
          success: false,
          error: `No prompt generator found for step: ${step}`,
        };
      }

      const { systemPrompt, userPrompt, assistant } = promptFunc(fiche);

      console.log(`Generating content for step: ${step}`);
      
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
          ...(assistant ? [{ role: 'assistant', content: assistant }] : []),
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content || '';

      return {
        step,
        content,
        success: true,
      };
    } catch (error) {
      console.error(`Error generating step ${step}:`, error);
      return {
        step,
        content: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Run the complete lesson generation workflow
   */
  async *generateLesson(fiche: Fiche): AsyncGenerator<AgentResult> {
    const steps = getSteps(fiche.classe);
    
    for (const stepConfig of steps) {
      const result = await this.generateStep(fiche, stepConfig.slug);
      yield result;
      
      if (!result.success) {
        console.error(`Failed to generate ${stepConfig.slug}, stopping workflow`);
        break;
      }
      
      // Update fiche with generated content
      this.updateFicheWithStepContent(fiche, stepConfig.slug, result.content);
    }
  }

  /**
   * Update fiche object with step content
   */
  private updateFicheWithStepContent(fiche: Fiche, step: FicheStep, content: string): void {
    // Map FicheStep enum to fiche properties
    const stepToProperty: Record<string, keyof Fiche> = {
      [FicheStep.Objectives]: 'objectives',
      [FicheStep.RevisionTeacher]: 'revisionTeacher',
      [FicheStep.RevisionStudent]: 'revisionStudent',
      [FicheStep.RevisionTeacherRappel]: 'revisionTeacherRappel',
      [FicheStep.RevisionStudentRappel]: 'revisionStudentRappel',
      [FicheStep.RevisionTeacherMotivation]: 'revisionTeacherMotivation',
      [FicheStep.RevisionStudentMotivation]: 'revisionStudentMotivation',
      [FicheStep.Situation]: 'situation',
      [FicheStep.ActivitePrincipaleTeacher]: 'activitePrincipaleTeacher',
      [FicheStep.ActivitePrincipaleStudent]: 'activitePrincipaleStudent',
      [FicheStep.SyntheseTeacher]: 'syntheseTeacher',
      [FicheStep.SyntheseStudent]: 'syntheseStudent',
      [FicheStep.Exercice]: 'exercice',
      [FicheStep.SituationSimilaires]: 'situationSimilaire',
      [FicheStep.ActiviteControleApplicationTeacher]: 'activiteControleApplicationTeacher',
      [FicheStep.ActiviteControleApplicationStudent]: 'activiteControleApplicationStudent',
      [FicheStep.ActiviteControleResearchTeacher]: 'activiteControleResearchTeacher',
      [FicheStep.ActiviteControleResearchStudent]: 'activiteControleResearchStudent',
      [FicheStep.ActiviteControleEvaluationTeacher]: 'activiteControleEvaluationTeacher',
      [FicheStep.ActiviteControleEvaluationStudent]: 'activiteControleEvaluationStudent',
    };

    const property = stepToProperty[step];
    if (property) {
      (fiche as any)[property] = content;
    }
  }

  /**
   * Regenerate a specific step with user feedback
   */
  async regenerateStep(
    fiche: Fiche,
    step: FicheStep,
    userFeedback: string
  ): Promise<AgentResult> {
    try {
      const promptGenerator = getPromptGenerator(fiche.classe);
      const promptFunc = promptGenerator[step];

      if (!promptFunc) {
        return {
          step,
          content: '',
          success: false,
          error: `No prompt generator found for step: ${step}`,
        };
      }

      const { systemPrompt, userPrompt, assistant } = promptFunc(fiche);

      console.log(`Regenerating content for step: ${step} with feedback`);
      
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
          ...(assistant ? [{ role: 'assistant', content: assistant }] : []),
          { 
            role: 'user', 
            content: `Please revise based on this feedback: ${userFeedback}` 
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content || '';

      return {
        step,
        content,
        success: true,
      };
    } catch (error) {
      console.error(`Error regenerating step ${step}:`, error);
      return {
        step,
        content: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Save step to database with approval status
   */
  async saveStepToDatabase(
    ficheId: string,
    step: FicheStep,
    content: string,
    userInput?: string,
    approved: boolean = false
  ): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO step_history (fiche_id, step_name, agent_output, user_input, approved)
         VALUES ($1, $2, $3, $4, $5)`,
        [ficheId, step, content, userInput, approved]
      );
    } finally {
      client.release();
    }
  }

  /**
   * Generate embedding for semantic search
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0].embedding;
  }

  /**
   * Store lesson embedding for search
   */
  async storeLessonEmbedding(ficheId: string, content: string): Promise<void> {
    const embedding = await this.generateEmbedding(content);
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO lesson_embeddings (fiche_id, content, embedding)
         VALUES ($1, $2, $3)`,
        [ficheId, content, JSON.stringify(embedding)]
      );
    } finally {
      client.release();
    }
  }
}