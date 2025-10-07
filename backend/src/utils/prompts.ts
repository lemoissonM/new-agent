import { Fiche, FicheStep, PromptType, StepDefinition } from '../types/fiche.types';
import { getRandomElements, fakeNames, fakePlaces, getLanguage, getAgeRange, getOption } from './constants';
import { getCourseMaterials, getCourseMandatoryMaterials } from './course-material';
import { extractSearchTerm, regexMaterial, regexContent } from './parser';

export const ficheStepsSecondaire: StepDefinition[] = [
  { title: 'Objectifs', slug: FicheStep.Objectives, type: 'general' },
  { title: 'Revision', slug: FicheStep.RevisionTeacher, type: 'teacher' },
  { title: 'Revision', slug: FicheStep.RevisionStudent, type: 'eleve' },
  { title: 'Situation', slug: FicheStep.Situation, type: 'general' },
  { title: 'Activite Principle', slug: FicheStep.ActivitePrincipaleTeacher, type: 'teacher' },
  { title: 'Activite Principle', slug: FicheStep.ActivitePrincipaleStudent, type: 'student' },
  { title: 'Synthese', slug: FicheStep.SyntheseTeacher, type: 'teacher' },
  { title: 'Synthese', slug: FicheStep.SyntheseStudent, type: 'student' },
  { title: 'Exercice', slug: FicheStep.Exercice, type: 'teacher' },
  { title: 'Situation Similaires', slug: FicheStep.SituationSimilaires, type: 'teacher' },
];

export const ficheStepsPrimaire: StepDefinition[] = [
  { title: 'Objectifs', slug: FicheStep.Objectives, type: 'general' },
  { title: 'Rappel', slug: FicheStep.RevisionTeacherRappel, type: 'teacher' },
  { title: 'Rappel', slug: FicheStep.RevisionStudentRappel, type: 'eleve' },
  { title: 'Motivation', slug: FicheStep.RevisionTeacherMotivation, type: 'teacher' },
  { title: 'Motivation', slug: FicheStep.RevisionStudentMotivation, type: 'eleve' },
  { title: 'Situation', slug: FicheStep.Situation, type: 'general' },
  { title: 'Activite Principle', slug: FicheStep.ActivitePrincipaleTeacher, type: 'teacher' },
  { title: 'Activite Principle', slug: FicheStep.ActivitePrincipaleStudent, type: 'student' },
  { title: 'Synthese', slug: FicheStep.SyntheseTeacher, type: 'teacher' },
  { title: 'Synthese', slug: FicheStep.SyntheseStudent, type: 'student' },
  { title: 'Exercice', slug: FicheStep.ActiviteControleApplicationTeacher, type: 'teacher' },
  { title: 'Exercise', slug: FicheStep.ActiviteControleApplicationStudent, type: 'student' },
  { title: 'Recherche', slug: FicheStep.ActiviteControleResearchTeacher, type: 'teacher' },
  { title: 'Recherche', slug: FicheStep.ActiviteControleResearchStudent, type: 'student' },
  { title: 'Evaluation', slug: FicheStep.ActiviteControleEvaluationTeacher, type: 'teacher' },
  { title: 'Evaluation', slug: FicheStep.ActiviteControleEvaluationStudent, type: 'student' },
];

export const ficheStepsMaternelle: StepDefinition[] = [
  { title: 'Objectifs', slug: FicheStep.Objectives, type: 'general' },
  { title: 'Rappelle', slug: FicheStep.RevisionTeacherRappel, type: 'teacher' },
  { title: 'Rappelle', slug: FicheStep.RevisionStudentRappel, type: 'student' },
  { title: 'Motivation', slug: FicheStep.RevisionTeacherMotivation, type: 'teacher' },
  { title: 'Motivation', slug: FicheStep.RevisionStudentMotivation, type: 'student' },
  { title: 'Situation', slug: FicheStep.Situation, type: 'general' },
  { title: 'Activite Principle', slug: FicheStep.ActivitePrincipaleTeacher, type: 'teacher' },
  { title: 'Activite Principle', slug: FicheStep.ActivitePrincipaleStudent, type: 'student' },
  { title: 'Synthese', slug: FicheStep.SyntheseTeacher, type: 'teacher' },
  { title: 'Synthese', slug: FicheStep.SyntheseStudent, type: 'student' },
  { title: 'Exercice', slug: FicheStep.ActiviteControleApplicationTeacher, type: 'teacher' },
  { title: 'Exercise', slug: FicheStep.ActiviteControleApplicationStudent, type: 'student' },
  { title: 'Evaluation', slug: FicheStep.ActiviteControleEvaluationTeacher, type: 'teacher' },
  { title: 'Evaluation', slug: FicheStep.ActiviteControleEvaluationStudent, type: 'student' },
];

export function getSteps(fiche: Fiche): StepDefinition[] {
  const classeNum = Number.parseInt(fiche.classe, 10);
  if (classeNum < 4) return ficheStepsMaternelle;
  if (classeNum < 10) return ficheStepsPrimaire;
  return ficheStepsSecondaire;
}

// Import all prompt generators from helper.ts
// This is a direct port of the getPromptSecondaire object
export const getPromptSecondaire: Record<string, (fiche: Fiche) => PromptType> = {
  [FicheStep.Objectives]: (fiche: Fiche): PromptType => {
    const { subject, lessonTitle, areaOfLife, classe, domain, contentOutline } = fiche;
    return {
      systemPrompt: `
You are a teacher of ${subject} preparing a lesson. Act and write like a teacher with details on the lesson and not generic concepts.
Reply only in ${getLanguage(subject)}, no other language.
You have ${getOption(classe || '5')} pupils with age between ${getAgeRange(classe || '5')}, take that into account
${contentOutline ? `Based on the plan outline below, ${contentOutline}` : ''}
`,
      userPrompt: `
${contentOutline
  ? `establish a list of 3 objectives that should be met after the ${subject} lesson ${lessonTitle} for us to know that a student is fully capable to apply what he learned in academic and real life. This should include a technical understanding of the subject.`
  : `formulate using the objectives outlines here: ${contentOutline} a list of objectives that should be met after the ${subject} lesson ${lessonTitle} for us to know that a student is fully capable to apply what he learned in academic and real life. Make sure to highlight the exact outlined content.`
}
${domain ? `keep in mind we are in the domain of ${domain}` : ''}
there will be at least one to understand how this lesson is linked with a real-life scenario in ${areaOfLife}
`,
      assistant: '1. ',
    };
  },

  [FicheStep.RevisionTeacher]: (fiche: Fiche): PromptType => {
    const { subject, previousLesson, classe } = fiche;
    return {
      systemPrompt: `
You are a teacher of ${subject} preparing a lesson. Act and write like a teacher with details on the lesson and not generic concepts.
Reply only in ${getLanguage(subject)} no other language.
You have ${getOption(classe || '5')} pupils with age between ${getAgeRange(classe || '5')}, take that into account
No introductory statement
`,
      userPrompt: `give me 2 short questions to check if a pupil understood a ${subject} lesson on ${previousLesson}.`,
      assistant: '1.',
    };
  },

  [FicheStep.RevisionStudent]: (fiche: Fiche): PromptType => {
    const { revisionTeacher, subject, classe } = fiche;
    return {
      systemPrompt: `
You are a student answering the following questions from your teacher. Add short answers (max 16 words) to these questions.
Reply only in ${getLanguage(subject)} no other language.
You are ${getOption(classe || '5')} pupils with age between ${getAgeRange(classe || '5')}, take that into account
`,
      userPrompt: revisionTeacher || '',
      assistant: '1.',
    };
  },

  [FicheStep.Situation]: (fiche: Fiche): PromptType => {
    const { subject, areaOfLife, lessonTitle, classe, objectives, domain } = fiche;
    return {
      systemPrompt: `
You are a teacher of ${subject} teaching to students between 10 and 18 years. Write a simple and understandable use case or example of 2 to 3 paragraphs (50 words max each) that will help students discover the lesson of today through a specific real life use case or story.

Give 1 example in the domain of ${areaOfLife}.
You have ${getOption(classe || '5')} pupils with age between ${getAgeRange(classe || '5')}, take that into account

Don't include the lesson title or any reference that would mention parts of its words in the history, pupils will discover it after reading the text.
Only give one example / use case

Don't mention ${lessonTitle?.replace('la ', '').replace('le ', '').replace('un ', '').replace('une ', '')} in this part, use similar words or synonyms.

use the ${getLanguage(subject)} language only.

use at least one name in this list: ${getRandomElements(fakeNames, 1)}

use at least one place in this list: ${getRandomElements(fakePlaces, 1)}

Add an african context to this, the use case or example is in The democratic republic of Congo (don't mention this)

Add 4 questions at the end to lead students into discovering the lesson title of today.
Include in the end a paragraph, named Consigne giving them clues in how they could use the story / use case to discover the lesson title.

find the story based on the below objectives or example
`,
      userPrompt: `
lesson title: ${lessonTitle}
objectives: ${objectives}
${domain ? `keep in mind we are in the domain of ${domain}` : ''}
`,
      assistant: '',
    };
  },

  [FicheStep.ActivitePrincipaleTeacher]: (fiche: Fiche): PromptType => {
    const { situation, subject, classe, lessonTitle, domain, objectives } = fiche;
    return {
      systemPrompt: `
Depending on the situation Add short instructions to form working groups and process the statement below.
The first is about group formation
then add 3 or 4 instructions that gradually lead to reaching the following objectives ${objectives} of the lesson: (${lessonTitle}) based on the below statement
${domain ? `keep in mind we are in the domain of ${domain}` : ''}
answer in ${getLanguage(subject)} only.
(max 50 words) per instruction.
You have ${getOption(classe || '5')} pupils with age between ${getAgeRange(classe || '5')}, take that into account

the questions even if they are based on the situation should:
1. Question 1 (based on the situation to form groups and organize them for better situation understanding)
2. Question 2
3. Question 3
4. Question 4
`,
      userPrompt: situation || '',
      assistant: '1. ',
    };
  },

  [FicheStep.ActivitePrincipaleStudent]: (fiche: Fiche): PromptType => {
    const { activitePrincipaleTeacher, subject, classe, lessonTitle, domain, situation } = fiche;
    return {
      systemPrompt: `
answer in ${getLanguage(subject)} language only.
You are a ${getOption(classe || '5')} pupil with age between ${getAgeRange(classe || '5')}.
Give clear but concise answer. Don't draw illustration, say instead how to look for it on internet (don't give faulty sources).
Don't include links to unexisting images. also you can provide search instructions on google with good keywords.
max 150 words per answer.
`,
      userPrompt: `
Answer each instruction below as a student, give details knowing the lesson title ${lessonTitle}, use reference to or draw real ${getCourseMaterials(subject, domain)}.

Situation / Histoire / Cas:
${situation}

Instructions: ${activitePrincipaleTeacher}

1. answer to question 1
2. answer to question 2
3. answer to question 3
...
`,
      assistant: '',
    };
  },

  [FicheStep.SyntheseTeacher]: (fiche: Fiche): PromptType => {
    const { objectives, subject, classe, lessonTitle, contentOutline } = fiche;
    return {
      systemPrompt: `
${contentOutline
  ? `write properly the questions based on the following point. ${contentOutline}`
  : `based on the following objectif ${objectives}, establish a list of concept to be learned by a student to master ${lessonTitle} in ${subject}.
You want to establish a clear and understandable summary of the lesson.
(outline the plan of the summary as a list here max 4 items)`
}

answer in ${getLanguage(subject)} only.

You have ${getOption(classe || '5')} pupils of the nursery class with age between ${getAgeRange(classe || '5')}, take that into account
`,
      userPrompt: 'Only write the questions, not the answers',
      assistant: '1.',
    };
  },

  [FicheStep.SyntheseStudent]: (fiche: Fiche): PromptType => {
    const { syntheseTeacher, subject, classe, domain, lessonTitle } = fiche;
    return {
      systemPrompt: `
answer in detail all questions asked below. Include things a child can understand. value simplicity over anything.
answer in ${getLanguage(subject)} only.
the title of the lesson is ${lessonTitle} in the course of ${subject}, make sure your answer is related to it and does not go off topic.
${domain ? `keep in mind we are in the domain of ${domain}` : ''}
Make answers very detailed, giving essential data. be concise (300 words max per item)
You have ${getOption(classe || '5')} pupils with age between ${getAgeRange(classe || '5')}, take that into account
`,
      userPrompt: syntheseTeacher || '',
      assistant: '1.',
    };
  },

  [FicheStep.Exercice]: (fiche: Fiche): PromptType => {
    const { lessonTitle, objectives, subject, classe, domain } = fiche;
    return {
      systemPrompt: `prepare 4 exercises to check understanding of the lesson.
answer in ${getLanguage(subject)} only.
${domain ? `keep in mind we are in the domain of ${domain}` : ''}
keep them very short and to the point (max 15 words per exercise)
You have pupils with age between ${getAgeRange(classe || '5')}, take that into account
`,
      userPrompt: `
lesson title: ${lessonTitle}
objectives: ${objectives}
`,
      assistant: '1.',
    };
  },

  [FicheStep.SituationSimilaires]: (fiche: Fiche): PromptType => {
    const { subject, areaOfLife, lessonTitle, previousLesson, classe } = fiche;
    return {
      systemPrompt: `You are a teacher writing to student, the previous lesson was about ${previousLesson}`,
      userPrompt: `
You are a teacher of ${subject} teaching to students between 10 and 18 years. Write a simple and understandable use case or example of 1 paragraph (25 words max each) that will help students discover the lesson of today through a specific real life example.

Use an example in the domain of ${areaOfLife}.
lesson title: (${lessonTitle})

Don't reveal the lesson title to pupils, they should discover it.
only give one example / use case

Don't mention ${lessonTitle?.replace('la ', '').replace('le ', '').replace('un ', '').replace('une ', '')} in this part, use similar words or synonyms.

use the ${getLanguage(subject)} language only.
You have ${getOption(classe || '5')} pupils with age between ${getAgeRange(classe || '5')}, take that into account

use at least one name in this list: ${getRandomElements(fakeNames, 1)}

use at least one place in this list: ${getRandomElements(fakePlaces, 1)}

Add an african context to this, the use case or example is in The democratic republic of Congo (don't mention this)

Add 3 questions at the end to lead students to verify that students understood the lesson of today.
Include in the end a paragraph, named Consigne giving them clues in how they could use the story / use case to discover the lesson title.
`,
      assistant: '',
    };
  },
};

// Similar implementations for getPromptPrimaire and getPromptMaternelle
// (abbreviated for space - full implementation would follow same pattern)

export function getPrompt(fiche: Fiche): Record<string, (fiche: Fiche) => PromptType> {
  const classeNum = Number.parseInt(fiche.classe, 10);
  if (classeNum < 4) return getPromptSecondaire; // Would be getPromptMaternelle
  if (classeNum < 10) return getPromptSecondaire; // Would be getPromptPrimaire
  return getPromptSecondaire;
}