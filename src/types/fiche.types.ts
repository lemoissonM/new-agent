export interface Fiche {
  id?: string;
  subject: string;
  lessonTitle: string;
  areaOfLife: string;
  classe: string;
  domain?: string;
  contentOutline?: string;
  previousLesson?: string;
  
  // Generated content for each step
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
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  status?: 'draft' | 'in_progress' | 'completed';
  currentStep?: string;
}

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

export interface FicheStepConfig {
  title: string;
  slug: FicheStep;
  type: 'general' | 'teacher' | 'student' | 'eleve';
}

export interface PromptType {
  systemPrompt: string;
  userPrompt: string;
  assistant: string;
}

export interface Class {
  id: string;
  name: string;
  optionName?: string;
  option?: string;
  ageRange?: string;
}

export type LessonLevel = 'maternelle' | 'primaire' | 'secondaire';