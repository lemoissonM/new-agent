import { z } from 'zod';

export enum FicheStep {
  Objectives = 'objectives',
  RevisionTeacher = 'revisionTeacher',
  RevisionStudent = 'revisionStudent',
  Situation = 'situation',
  ActivitePrincipaleTeacher = 'activitePrincipaleTeacher',
  ActivitePrincipaleStudent = 'activitePrincipaleStudent',
  SyntheseTeacher = 'syntheseTeacher',
  SyntheseStudent = 'syntheseStudent',
  Exercice = 'exercice',
  SituationSimilaires = 'situationSimilaire',
  RevisionTeacherRappel = 'revisionTeacherRappel',
  RevisionStudentRappel = 'revisionStudentRappel',
  RevisionTeacherMotivation = 'revisionTeacherMotivation',
  RevisionStudentMotivation = 'revisionStudentMotivation',
  ResumeTeacher = 'resumeTeacher',
  ResumeStudent = 'resumeStudent',
  ActiviteControleApplicationTeacher = 'activiteControleApplicationTeacher',
  ActiviteControleApplicationStudent = 'activiteControleApplicationStudent',
  ActiviteControleResearchTeacher = 'activiteControleResearchTeacher',
  ActiviteControleResearchStudent = 'activiteControleResearchStudent',
  ActiviteControleEvaluationTeacher = 'activiteControleEvaluationTeacher',
  ActiviteControleEvaluationStudent = 'activiteControleEvaluationStudent',
}

export interface StepDefinition {
  title: string;
  slug: FicheStep;
  type: 'general' | 'teacher' | 'student' | 'eleve';
}

export interface PromptType {
  systemPrompt: string;
  userPrompt: string;
  assistant: string;
}

export const FicheSchema = z.object({
  id: z.string().uuid().optional(),
  subject: z.string(),
  lessonTitle: z.string(),
  areaOfLife: z.string().optional(),
  classe: z.string(),
  domain: z.string().optional(),
  contentOutline: z.string().optional(),
  previousLesson: z.string().optional(),
  objectives: z.string().optional(),
  revisionTeacher: z.string().optional(),
  revisionStudent: z.string().optional(),
  revisionTeacherRappel: z.string().optional(),
  revisionStudentRappel: z.string().optional(),
  revisionTeacherMotivation: z.string().optional(),
  revisionStudentMotivation: z.string().optional(),
  situation: z.string().optional(),
  activitePrincipaleTeacher: z.string().optional(),
  activitePrincipaleStudent: z.string().optional(),
  syntheseTeacher: z.string().optional(),
  syntheseStudent: z.string().optional(),
  exercice: z.string().optional(),
  situationSimilaire: z.string().optional(),
  activiteControleApplicationTeacher: z.string().optional(),
  activiteControleApplicationStudent: z.string().optional(),
  activiteControleResearchTeacher: z.string().optional(),
  activiteControleResearchStudent: z.string().optional(),
  activiteControleEvaluationTeacher: z.string().optional(),
  activiteControleEvaluationStudent: z.string().optional(),
  currentStep: z.number().optional(),
  status: z.enum(['draft', 'in_progress', 'completed']).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Fiche = z.infer<typeof FicheSchema>;

export interface StepExecutionResult {
  step: FicheStep;
  content: string;
  status: 'success' | 'error' | 'pending_approval';
  error?: string;
}

export interface LessonSession {
  id: string;
  ficheId: string;
  currentStepIndex: number;
  completedSteps: FicheStep[];
  pendingApproval: boolean;
  createdAt: Date;
  updatedAt: Date;
}