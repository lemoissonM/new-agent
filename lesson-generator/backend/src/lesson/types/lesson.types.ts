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

export interface StepConfig {
  title: string;
  slug: FicheStep;
  type: 'teacher' | 'student' | 'general' | 'eleve';
}

export interface Fiche {
  subject: string;
  lessonTitle: string;
  areaOfLife?: string;
  classe?: string;
  domain?: string;
  contentOutline?: string;
  previousLesson?: string;
  objectives?: string;
  revisionTeacher?: string;
  revisionTeacherRappel?: string;
  revisionTeacherMotivation?: string;
  revisionStudentRappel?: string;
  revisionStudentMotivation?: string;
  situation?: string;
  activitePrincipaleTeacher?: string;
  activitePrincipaleStudent?: string;
  syntheseTeacher?: string;
  syntheseStudent?: string;
  activiteControleApplicationTeacher?: string;
  activiteControleApplicationStudent?: string;
  activiteControleResearchTeacher?: string;
  activiteControleResearchStudent?: string;
  activiteControleEvaluationTeacher?: string;
  activiteControleEvaluationStudent?: string;
}

export interface PromptType {
  systemPrompt: string;
  userPrompt: string;
  assistant: string;
}

export type LessonLevel = 'maternelle' | 'primaire' | 'secondaire';