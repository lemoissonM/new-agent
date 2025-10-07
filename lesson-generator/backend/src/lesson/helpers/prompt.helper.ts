import { Fiche, PromptType, FicheStep } from '../types/lesson.types';

const fakeNames = ['Amina', 'Mbuyi', 'Kasongo', 'Ngoy', 'Kabila', 'Tshisekedi'];
const fakePlaces = ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani'];

function getRandomElements<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getLanguage(subject: string): string {
  const lowerSubject = subject?.toLowerCase() || '';
  return ['english', 'anglais', 'anglai', 'kingereza', 'inglish'].includes(
    lowerSubject,
  )
    ? 'English'
    : 'French';
}

export function getAgeRange(classe: string): string {
  const classeNum = parseInt(classe, 10);
  if (classeNum <= 6) return '5-12 years';
  if (classeNum <= 12) return '10-18 years';
  return '2-5 years';
}

export function getOption(classe: string): string {
  const classeNum = parseInt(classe, 10);
  if (classeNum <= 6) return 'primary school';
  if (classeNum <= 12) return 'secondary school';
  return 'nursery';
}

// Simplified prompt generators - you would import the full ones from helper.ts
export const promptGenerators: Record<
  FicheStep,
  (fiche: Fiche) => PromptType
> = {
  [FicheStep.Objectives]: (fiche): PromptType => ({
    systemPrompt: `You are a teacher of ${fiche.subject} preparing a lesson. Act and write like a teacher with details on the lesson.
      Reply only in ${getLanguage(fiche.subject)}, no other language.`,
    userPrompt: `Establish a list of 3 objectives that should be met after the ${fiche.subject} lesson "${fiche.lessonTitle}".
      ${fiche.areaOfLife ? `Include how this lesson is linked with real-life scenario in ${fiche.areaOfLife}.` : ''}`,
    assistant: '1. ',
  }),

  [FicheStep.RevisionTeacher]: (fiche): PromptType => ({
    systemPrompt: `You are a teacher of ${fiche.subject} preparing a lesson. 
      Reply only in ${getLanguage(fiche.subject)}.`,
    userPrompt: `Give me 2 short questions to check if a pupil understood a ${fiche.subject} lesson on ${fiche.previousLesson}.`,
    assistant: '1.',
  }),

  [FicheStep.RevisionStudent]: (fiche): PromptType => ({
    systemPrompt: `You are a student answering questions from your teacher. Add short answers (max 16 words).
      Reply only in ${getLanguage(fiche.subject)}.`,
    userPrompt: fiche.revisionTeacher || '',
    assistant: '1.',
  }),

  [FicheStep.Situation]: (fiche): PromptType => ({
    systemPrompt: `You are a teacher of ${fiche.subject}. Write a simple use case or example of 2 to 3 paragraphs (50 words max each).
      Use the ${getLanguage(fiche.subject)} language only.
      Use at least one name: ${getRandomElements(fakeNames, 1).join(', ')}
      Use at least one place: ${getRandomElements(fakePlaces, 1).join(', ')}
      Add an african context (Democratic Republic of Congo).
      Add 4 questions at the end to lead students into discovering the lesson title.`,
    userPrompt: `Lesson title: ${fiche.lessonTitle}
      Objectives: ${fiche.objectives}`,
    assistant: '',
  }),

  // Add other step generators here...
  // For brevity, I'm showing a pattern - you would add all steps from helper.ts
  [FicheStep.ActivitePrincipaleTeacher]: (fiche): PromptType => ({
    systemPrompt: `Add short instructions to form working groups and process the statement.
      Answer in ${getLanguage(fiche.subject)} only.`,
    userPrompt: fiche.situation || '',
    assistant: '1. ',
  }),

  [FicheStep.ActivitePrincipaleStudent]: (fiche): PromptType => ({
    systemPrompt: `Answer in ${getLanguage(fiche.subject)} language only.
      Give detailed but concise answers. Max 150 words per answer.`,
    userPrompt: `Answer each instruction as a student, knowing the lesson title is ${fiche.lessonTitle}.
      Situation: ${fiche.situation}
      Instructions: ${fiche.activitePrincipaleTeacher}`,
    assistant: '1. ',
  }),

  [FicheStep.SyntheseTeacher]: (fiche): PromptType => ({
    systemPrompt: `Based on the following objectives, establish a list of concepts to be learned.
      Answer in ${getLanguage(fiche.subject)} only.`,
    userPrompt: fiche.objectives || '',
    assistant: '1.',
  }),

  [FicheStep.SyntheseStudent]: (fiche): PromptType => ({
    systemPrompt: `Answer in detail all questions asked. Value simplicity.
      Answer in ${getLanguage(fiche.subject)} only. Max 300 words per item.`,
    userPrompt: fiche.syntheseTeacher || '',
    assistant: '1.',
  }),

  [FicheStep.Exercice]: (fiche): PromptType => ({
    systemPrompt: `Prepare 4 exercises to check understanding of the lesson.
      Answer in ${getLanguage(fiche.subject)} only. Max 15 words per exercise.`,
    userPrompt: `Lesson title: ${fiche.lessonTitle}
      Objectives: ${fiche.objectives}`,
    assistant: '1.',
  }),

  [FicheStep.SituationSimilaires]: (fiche): PromptType => ({
    systemPrompt: `You are a teacher writing to students.`,
    userPrompt: `Write a simple use case or example (25 words max) in ${getLanguage(fiche.subject)}.
      Lesson: ${fiche.lessonTitle}
      Add 3 questions to verify understanding.`,
    assistant: '',
  }),

  // Additional steps for Primaire and Maternelle levels
  [FicheStep.RevisionTeacherRappel]: (fiche): PromptType => ({
    systemPrompt: `You are a teacher. Reply in ${getLanguage(fiche.subject)} only.`,
    userPrompt: `Give 2 short questions about ${fiche.previousLesson}.`,
    assistant: '1.',
  }),

  [FicheStep.RevisionStudentRappel]: (fiche): PromptType => ({
    systemPrompt: `You are a student. Short answers (max 16 words). Reply in ${getLanguage(fiche.subject)}.`,
    userPrompt: fiche.revisionTeacherRappel || '',
    assistant: '1.',
  }),

  [FicheStep.RevisionTeacherMotivation]: (fiche): PromptType => ({
    systemPrompt: `You are a teacher. Reply in ${getLanguage(fiche.subject)} only.`,
    userPrompt: `List 2 didactic materials to motivate students to learn ${fiche.lessonTitle}.`,
    assistant: '1.',
  }),

  [FicheStep.RevisionStudentMotivation]: (fiche): PromptType => ({
    systemPrompt: `You are a student. Short answers (max 16 words). Reply in ${getLanguage(fiche.subject)}.`,
    userPrompt: fiche.revisionTeacherMotivation || '',
    assistant: '1.',
  }),

  [FicheStep.ResumeTeacher]: (fiche): PromptType => ({
    systemPrompt: `Create a summary. Reply in ${getLanguage(fiche.subject)}.`,
    userPrompt: `Lesson: ${fiche.lessonTitle}, Objectives: ${fiche.objectives}`,
    assistant: '1.',
  }),

  [FicheStep.ResumeStudent]: (fiche): PromptType => ({
    systemPrompt: `Answer questions. Reply in ${getLanguage(fiche.subject)}.`,
    userPrompt: fiche.syntheseTeacher || '',
    assistant: '1.',
  }),

  [FicheStep.ActiviteControleApplicationTeacher]: (fiche): PromptType => ({
    systemPrompt: `Prepare 4 exercises. Reply in ${getLanguage(fiche.subject)}.`,
    userPrompt: `Lesson: ${fiche.lessonTitle}, Objectives: ${fiche.objectives}`,
    assistant: '1.',
  }),

  [FicheStep.ActiviteControleApplicationStudent]: (fiche): PromptType => ({
    systemPrompt: `Answer exercises. Reply in ${getLanguage(fiche.subject)}.`,
    userPrompt: fiche.activiteControleApplicationTeacher || '',
    assistant: '1.',
  }),

  [FicheStep.ActiviteControleResearchTeacher]: (fiche): PromptType => ({
    systemPrompt: `Prepare research topics. Reply in ${getLanguage(fiche.subject)}.`,
    userPrompt: `Prepare two research items for ${fiche.lessonTitle}.`,
    assistant: '1.',
  }),

  [FicheStep.ActiviteControleResearchStudent]: (fiche): PromptType => ({
    systemPrompt: `Answer research items. Reply in ${getLanguage(fiche.subject)}.`,
    userPrompt: fiche.activiteControleResearchTeacher || '',
    assistant: '1.',
  }),

  [FicheStep.ActiviteControleEvaluationTeacher]: (fiche): PromptType => ({
    systemPrompt: `Prepare 4 evaluation exercises. Reply in ${getLanguage(fiche.subject)}.`,
    userPrompt: `Lesson: ${fiche.lessonTitle}, Objectives: ${fiche.objectives}`,
    assistant: '1.',
  }),

  [FicheStep.ActiviteControleEvaluationStudent]: (fiche): PromptType => ({
    systemPrompt: `Answer evaluation exercises. Reply in ${getLanguage(fiche.subject)}.`,
    userPrompt: fiche.activiteControleEvaluationTeacher || '',
    assistant: '1.',
  }),
};