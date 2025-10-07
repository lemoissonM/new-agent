export interface Lesson {
  id?: number;
  title: string;
  subject: string;
  classe: string;
  domain?: string;
  areaOfLife?: string;
  previousLesson?: string;
  contentOutline?: string;
  status?: 'draft' | 'in_progress' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LessonStep {
  id?: number;
  lessonId: number;
  stepName: string;
  stepType: 'general' | 'teacher' | 'student' | 'eleve';
  content?: string;
  userFeedback?: string;
  approved?: boolean;
  agentMetadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AgentConversation {
  id?: number;
  lessonId: number;
  stepId?: number;
  role: 'system' | 'user' | 'assistant';
  content: string;
  embedding?: number[];
  createdAt?: Date;
}

export interface StepConfig {
  title: string;
  slug: string;
  type: 'general' | 'teacher' | 'student' | 'eleve';
}

export interface PromptConfig {
  systemPrompt: string;
  userPrompt: string;
  assistant: string;
}

export interface LessonData extends Lesson {
  // Step-specific fields
  objectives?: string;
  revisionTeacher?: string;
  revisionStudent?: string;
  revisionTeacherRappel?: string;
  revisionStudentRappel?: string;
  revisionTeacherMotivation?: string;
  revisionStudentMotivation?: string;
  situation?: string;
  activitePrincipaleTeacher?: string;
  activitePrincipaleStudent?: string;
  syntheseTeacher?: string;
  syntheseStudent?: string;
  exercice?: string;
  situationSimilaire?: string;
  resumeTeacher?: string;
  resumeStudent?: string;
  activiteControleApplicationTeacher?: string;
  activiteControleApplicationStudent?: string;
  activiteControleResearchTeacher?: string;
  activiteControleResearchStudent?: string;
  activiteControleEvaluationTeacher?: string;
  activiteControleEvaluationStudent?: string;
}