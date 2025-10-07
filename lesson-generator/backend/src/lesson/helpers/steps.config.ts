import { FicheStep, StepConfig } from '../types/lesson.types';

export const ficheStepsSecondaire: StepConfig[] = [
  { title: 'Objectifs', slug: FicheStep.Objectives, type: 'general' },
  { title: 'Revision', slug: FicheStep.RevisionTeacher, type: 'teacher' },
  { title: 'Revision', slug: FicheStep.RevisionStudent, type: 'eleve' },
  { title: 'Situation', slug: FicheStep.Situation, type: 'general' },
  {
    title: 'Activite Principle',
    slug: FicheStep.ActivitePrincipaleTeacher,
    type: 'teacher',
  },
  {
    title: 'Activite Principle',
    slug: FicheStep.ActivitePrincipaleStudent,
    type: 'student',
  },
  { title: 'Synthese', slug: FicheStep.SyntheseTeacher, type: 'teacher' },
  { title: 'Synthese', slug: FicheStep.SyntheseStudent, type: 'student' },
  { title: 'Exercice', slug: FicheStep.Exercice, type: 'teacher' },
  {
    title: 'Situation Similaires',
    slug: FicheStep.SituationSimilaires,
    type: 'teacher',
  },
];

export const ficheStepsPrimaire: StepConfig[] = [
  { title: 'Objectifs', slug: FicheStep.Objectives, type: 'general' },
  { title: 'Rappel', slug: FicheStep.RevisionTeacherRappel, type: 'teacher' },
  {
    title: 'Rappel',
    slug: FicheStep.RevisionStudentRappel,
    type: 'eleve',
  },
  {
    title: 'Motivation',
    slug: FicheStep.RevisionTeacherMotivation,
    type: 'teacher',
  },
  {
    title: 'Motivation',
    slug: FicheStep.RevisionStudentMotivation,
    type: 'eleve',
  },
  { title: 'Situation', slug: FicheStep.Situation, type: 'general' },
  {
    title: 'Activite Principle',
    slug: FicheStep.ActivitePrincipaleTeacher,
    type: 'teacher',
  },
  {
    title: 'Activite Principle',
    slug: FicheStep.ActivitePrincipaleStudent,
    type: 'student',
  },
  { title: 'Synthese', slug: FicheStep.SyntheseTeacher, type: 'teacher' },
  { title: 'Synthese', slug: FicheStep.SyntheseStudent, type: 'student' },
  {
    title: 'Exercice',
    slug: FicheStep.ActiviteControleApplicationTeacher,
    type: 'teacher',
  },
  {
    title: 'Exercise',
    slug: FicheStep.ActiviteControleApplicationStudent,
    type: 'student',
  },
  {
    title: 'Recherche',
    slug: FicheStep.ActiviteControleResearchTeacher,
    type: 'teacher',
  },
  {
    title: 'Recherche',
    slug: FicheStep.ActiviteControleResearchStudent,
    type: 'student',
  },
  {
    title: 'Evaluation',
    slug: FicheStep.ActiviteControleEvaluationTeacher,
    type: 'teacher',
  },
  {
    title: 'Evaluation',
    slug: FicheStep.ActiviteControleEvaluationStudent,
    type: 'student',
  },
];

export const ficheStepsMaternelle: StepConfig[] = [
  { title: 'Objectifs', slug: FicheStep.Objectives, type: 'general' },
  {
    title: 'Rappelle',
    slug: FicheStep.RevisionTeacherRappel,
    type: 'teacher',
  },
  {
    title: 'Rappelle',
    slug: FicheStep.RevisionStudentRappel,
    type: 'student',
  },
  {
    title: 'Motivation',
    slug: FicheStep.RevisionTeacherMotivation,
    type: 'teacher',
  },
  {
    title: 'Motivation',
    slug: FicheStep.RevisionStudentMotivation,
    type: 'student',
  },
  {
    title: 'Situation',
    slug: FicheStep.Situation,
    type: 'general',
  },
  {
    title: 'Activite Principle',
    slug: FicheStep.ActivitePrincipaleTeacher,
    type: 'teacher',
  },
  {
    title: 'Activite Principle',
    slug: FicheStep.ActivitePrincipaleStudent,
    type: 'student',
  },
  { title: 'Synthese', slug: FicheStep.SyntheseTeacher, type: 'teacher' },
  { title: 'Synthese', slug: FicheStep.SyntheseStudent, type: 'student' },
  {
    title: 'Exercice',
    slug: FicheStep.ActiviteControleApplicationTeacher,
    type: 'teacher',
  },
  {
    title: 'Exercise',
    slug: FicheStep.ActiviteControleApplicationStudent,
    type: 'student',
  },
  {
    title: 'Evaluation',
    slug: FicheStep.ActiviteControleEvaluationTeacher,
    type: 'teacher',
  },
  {
    title: 'Evaluation',
    slug: FicheStep.ActiviteControleEvaluationStudent,
    type: 'student',
  },
];

export function getSteps(classe: string): StepConfig[] {
  const classeNum = parseInt(classe, 10);
  if (classeNum < 7) {
    return ficheStepsPrimaire;
  }
  if (classeNum < 13) {
    return ficheStepsSecondaire;
  }
  return ficheStepsMaternelle;
}