import { Fiche } from 'src/fiche/entities/fiche.entity';
import { fakeNames, fakePlaces, getRandomElements } from '../../names.faker';
import { classes } from 'src/teacher/classes';
import {
  extractSearchTerm,
  regexContent,
  regexMaterial,
} from 'src/whatsapp-session/utils/parser';
import {
  getCourseMandatoryMaterials,
  getCourseMaterials,
} from 'src/whatsapp-session/utils/course-material';

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

export const ficheStepsSecondaire = [
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

export const ficheStepsPrimaire = [
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

export const ficheStepsMaternelle = [
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

export type PromptType = {
  systemPrompt: string;
  userPrompt: string;
  assistant: string;
};

export const getlanguage = (subject: string) => {
  const language = [
    'english',
    'anglais',
    'anglai',
    'kingereza',
    'inglish',
  ].includes(subject?.toLowerCase())
    ? 'English'
    : 'French';
  return language;
};

export const getAgeRange = (classe) =>
  classes.find((c) => classe.toString() === c.id?.toString())?.ageRange;

export const getOption = (classe) =>
  classes.find((c) => classe.toString() === c.id?.toString())?.option;

export const getClasse = (classe) => {
  const c = classes.find((c) => classe.toString() === c.id?.toString());

  return `${c.name} ${c.optionName}`;
};

export const getPromptSecondaire: Record<string, (fiche: Fiche) => PromptType> =
  {
    [FicheStep.Objectives]: ({
      subject,
      lessonTitle,
      areaOfLife,
      classe,
      domain,
      contentOutline,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            You are a teacher of ${subject}  preparing a lesson. Act and write like a teacher. with details on the lesson and not generic concepts.
            Reply only in ${getlanguage(subject)}, no other language.
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
          classe || 5,
        )}, take that into account
            ${
              contentOutline
                ? `Based on the plan outline below, ${contentOutline}`
                : ''
            }
            `,
        userPrompt: `
            ${
              contentOutline
                ? `establish a list of 3  objectives that should be met after the ${subject}  lesson ${lessonTitle} for us to know that a student is fully capable to apply what he learned in academic and real life. This should include a technical understanding of the subject.`
                : `
               formulate using the objectives outlines here: ${contentOutline} a list of objectives that should be met after the ${subject} lesson ${lessonTitle} for us to know that a student is fully capable to apply what he learned in academic and real life. Make sure to highlight the exact outlined content.
              `
            }
            ${domain ? `keep in mind we are in the domain of ${domain}` : ''}
            there will be at least one to understand how this lesson is linked with a real-life scenario in ${areaOfLife}
            `,
        assistant: `1. `,
      };
    },
    [FicheStep.RevisionTeacher]: ({
      subject,
      previousLesson,
      classe,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            You are a teacher of ${subject}  preparing a lesson. Act and write like a teacher. with details on the lesson and not generic concepts.
            Reply only in ${getlanguage(
              subject,
            )} no other language in ${getlanguage(subject)}, nothing more.
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
          classe || 5,
        )}, take that into account
            No introductory statement
            `,
        userPrompt: `
            give me 2 short questions to check if a pupil understood a ${subject} lesson on ${previousLesson}.
            `,
        assistant: '1.',
      };
    },
    [FicheStep.RevisionStudent]: ({
      revisionTeacher,
      subject,
      classe,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            You are a student answering the following questions from your teacher. Add short answers (max 16 words) to these questions.
            reply only in ${getlanguage(subject)} no other language.
            You are ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
          classe || 5,
        )}, take that into account
            `,
        userPrompt: revisionTeacher,
        assistant: '1.',
      };
    },
    [FicheStep.Situation]: ({
      subject,
      areaOfLife,
      lessonTitle,
      classe,
      objectives,
      domain,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            You are a teacher of ${subject} teaching to students between 10 and 18 years. Write a simple and understandable use case or example of 2 to 3 paragraphs ( 50 words max each) that will help students discover the lesson of today through a specific real life use case or story..

            Give 1 example in the domain of ${areaOfLife}.
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
          classe || 5,
        )}, take that into account

            Don’t include the lesson title or any reference that would mention parts of its words in the history, pupils will discover it after reading the text.
            only give one example / use case

            Don’t mention ${lessonTitle
              .replace('la ', '')
              .replace('le ', '')
              .replace('un ', '')
              .replace('une ', '')} in this part, use similar words or synonyms.

            use the ${getlanguage(subject)} language only.

            use at least one name in this list : ${getRandomElements(
              fakeNames,
              1,
            )}

            use at least one place in this list:  ${getRandomElements(
              fakePlaces,
              1,
            )}

            Add an african context to this, the use case or example is in The democratic republic of Congo ( don't mention this)

            Add 4 questions at the end to lead students into discovering the lesson title of today.
            Include in the end a paragraph, named Consigne giving them clues in how they could use the story / use case to discover the lesson title.

            find the story based on the below objectives or example
            `,
        userPrompt: `
            lesson title : ${lessonTitle}
            objectives: ${objectives}
            ${domain ? `keep in mind we are in the domain of ${domain}` : ''}
            `,
        assistant: '',
      };
    },
    [FicheStep.ActivitePrincipaleTeacher]: ({
      situation,
      subject,
      classe,
      lessonTitle,
      domain,
      objectives,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            Depending on the situation Add short instructions to form working groups and process the statement below.
            The first is about group formation
            then add 3 or 4 instructions that gradually lead to reaching the following objectives ${objectives} of the lesson: (${lessonTitle}) based on the below statement
            ${domain ? `keep in mind we are in the domain of ${domain}` : ''}
            answer in ${getlanguage(subject)} only.
            (max 50 words) per instruction.
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
          classe || 5,
        )}, take that into account

            the questions even if they are based on the situation should 
            1. Question 1 ( based on the situation to form groups and organize them for better situation understanding) 
            2. Question 2
            3. Question 3 
            4. Question 4 
            `,
        userPrompt: situation,
        assistant: `1. `,
      };
    },
    [FicheStep.ActivitePrincipaleStudent]: ({
      activitePrincipaleTeacher,
      subject,
      classe,
      lessonTitle,
      domain,
      situation,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            answer in ${getlanguage(subject)} language only.
            You are a ${getOption(
              classe || 5,
            )} pupil with age between ${getAgeRange(classe || 5)}.
              Give clear but concise answer. Don't draw illustration, say instead how to look for it on internet ( don't give faulty sources).
              Don't isnclude links to unexisting images. also you can provide search instructions on google with good keywords.
              max 150 words per answer.
            `,
        userPrompt: `
        Answer each instruction below as a student, give details knowing the lesson title ${lessonTitle}, use reference to or draw real ${getCourseMaterials(
          subject,
          domain,
        )}. 

        Situation / Histoire / Cas :
        ${situation}

        Instructions: ${activitePrincipaleTeacher}

        1. answer to question 1
        2. answer to question 2
        3. answer to question 3
        ...
      `,
        assistant: ``,
      };
    },
    [FicheStep.SyntheseTeacher]: ({
      objectives,
      subject,
      classe,
      lessonTitle,
      contentOutline,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
             
              ${
                contentOutline
                  ? `write properly the questions based on the following point.  ${contentOutline}`
                  : `
                based on the following objectif ${objectives}, establish a list of conept to be learned by a student to master ${lessonTitle} in ${subject}.
                You want  to establish a clear and undertandable summary of the lesson.
                
                ( outline the plan of the summary as a list here max 4 items)`
              }

            answer in ${getlanguage(subject)} only.
            
            You have ${getOption(
              classe || 5,
            )} pupils of the nursery class with age between ${getAgeRange(
          classe || 5,
        )}, take that into account
            `,
        userPrompt: 'Only write the questions, not the answers',
        assistant: '1.',
      };
    },
    [FicheStep.SyntheseStudent]: ({
      syntheseTeacher,
      subject,
      classe,
      domain,
      lessonTitle,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            answer in detail all questions asked below. Include things a child can undertand. value simplicity over anything. 
            answer in ${getlanguage(subject)} only.
            the title of the lesson is ${lessonTitle} in the course of ${subject}, make sure your answer is related to it and does not go off topic.
            ${domain ? `keep in mind we are in the domain of ${domain}` : ''}
            Make answers very detailed, giving essential data. be concise  (300 words max per item)
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
          classe || 5,
        )}, take that into account
            `,
        userPrompt: syntheseTeacher,
        assistant: '1.',
      };
    },
    [FicheStep.Exercice]: ({
      lessonTitle,
      objectives,
      subject,
      classe,
      domain,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `prepare 4 exercises to check understanding of the lesson.
        answer in ${getlanguage(subject)} only.
        ${domain ? `keep in mind we are in the domain of ${domain}` : ''}
      keep them very short and to the point (max 15 words per exercise)
      You have pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account
      `,
        userPrompt: `
            lesson title: ${lessonTitle}
            objectives: ${objectives},
            `,
        assistant: '1.',
      };
    },
    [FicheStep.SituationSimilaires]: ({
      subject,
      areaOfLife,
      lessonTitle,
      previousLesson,
      classe,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `You are a teacher writing to student, the previous lesson was about ${previousLesson}`,
        userPrompt: `
      You are a teacher of ${subject} teaching to students between 10 and 18 years. Write a simple and understandable use case or example of 1 paragraph ( 25 words max each) that will help students discover the lesson of today through a specific real life example.

            Use an example in the domain of ${areaOfLife}.
            lesson title : (${lessonTitle})

            Don’t reveal the lesson title to pupils, they should discover it.
            only give one example / use case

            Don’t mention ${lessonTitle
              .replace('la ', '')
              .replace('le ', '')
              .replace('un ', '')
              .replace('une ', '')} in this part, use similar words or synonyms.

            use the ${getlanguage(subject)} language only.
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
          classe || 5,
        )}, take that into account

            use at least one name in this list : ${getRandomElements(
              fakeNames,
              1,
            )}

            use at least one place in this list:  ${getRandomElements(
              fakePlaces,
              1,
            )}

            Add an african context to this, the use case or example is in The democratic republic of Congo ( don't mention this)

            Add 3 questions at the end to lead students to verfiy that students understood the lesson of today.
            Include in the end a paragraph, named Consigne giving them clues in how they could use the story / use case to discover the lesson title.
            `,
        assistant: '',
      };
    },
  };

export const getPromptPrimaire: Record<string, (fiche: Fiche) => PromptType> = {
  [FicheStep.Objectives]: ({
    subject,
    lessonTitle,
    areaOfLife,
    classe,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `
            You are a teacher of ${subject}  preparing a lesson. Act and write like a teacher. with details on the lesson and not generic concepts.
            Reply in ${getlanguage(subject)} only, no other language.
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
        classe || 5,
      )}, make sure the objectives are adapted to their capacity. To what they might still be learning at that stage of their lives. the environment that might still have influence on them such as family, school, church, etc.
            `,
      userPrompt: `
            establish a list of 3  objectives that should be met after the ${subject}  lesson ${lessonTitle} for us to know that a student is fully capable to apply what he learned in academic and real life. This should include a technical understanding of the subject.
            there will be at least one to understand how this lesson is linked with a real-life scenario in ${areaOfLife}
            `,
      assistant: `A la fin de cette lecon, l'eleve aura acquis les competences suivants :
      1. 
      `,
    };
  },
  [FicheStep.RevisionTeacherRappel]: ({
    subject,
    previousLesson,
    classe,
    lessonTitle,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `
            You are a teacher of ${subject}  preparing a lesson. Act and write like a teacher. with details on the lesson and not generic concepts.
            Reply only in ${getlanguage(subject)} only.
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account
            No introductory statement
            `,
      userPrompt: `
            give me 2 short questions to check if a pupil understood ${subject} lesson on ${previousLesson}.
            These two questions should be simple and direct. They should be conversational. You can skip mentionning the subject ${subject} in the conversation. 
            These 2 questions should help you introduce the lesson of today ${lessonTitle}.
            `,
      assistant: '1.',
    };
  },
  [FicheStep.RevisionStudentRappel]: ({
    revisionTeacherRappel,
    subject,
    classe,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `
            You are a student answering the following questions from your teacher. Add short answers (max 16 words) to these questions.
            answer in ${getlanguage(subject)} only.
            You are ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account
            `,
      userPrompt: revisionTeacherRappel,
      assistant: '1.',
    };
  },
  [FicheStep.RevisionTeacherMotivation]: ({
    subject,
    classe,
    lessonTitle,
    situation,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `
            You are a teacher of ${subject}  preparing a lesson. Act and write like a teacher. with details on the lesson and not generic concepts.
            Reply only in ${getlanguage(subject)} no other language.
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account
            No introductory statement
            `,
      userPrompt: `
            list 2 didactic materials ( something that interact with senses, can be seen, heard, touched except videos) that you will use to motivate students to learn ${lessonTitle} ${
        situation ? `Reference : ${situation.split('\n')[0]}` : ''
      } in a ${subject} lesson. or will help him discover the lesson. for each option, give a short explanation (10 to 20 words) of how it will be used.
            `,
      assistant: '1.',
    };
  },
  [FicheStep.RevisionStudentMotivation]: ({
    revisionTeacherMotivation,
    classe,
    subject,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `
            You are a student answering presentend with the below information. provide an explanation on what you see or hear depending on the below information. Add short answers (max 16 words).
            Reply in ${getlanguage(subject)} only.
            You are ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account
            `,
      userPrompt: `1.${extractSearchTerm(
        revisionTeacherMotivation,
        regexMaterial,
      )}\n${extractSearchTerm(revisionTeacherMotivation, regexContent, 1)} `,
      assistant: '1.',
    };
  },
  [FicheStep.Situation]: ({
    subject,
    areaOfLife,
    lessonTitle,
    classe,
    objectives,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `
            You are a teacher of ${subject} teaching to students between 5 and 12 years. Write a simple and understandable use case or example of 2 to 3 paragraphs ( 50 words max each) that will help students discover the lesson of today through a specific real life use case or story..

            Give 1 example in the domain of ${areaOfLife}.
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account

           Don’t include the lesson title (${lessonTitle} ) or any reference that would mention parts of its words in the history, pupils will discover it after reading the text. 
            only give one example / use case

            Don’t mention ${lessonTitle
              .replace('la ', '')
              .replace('le ', '')
              .replace('un ', '')
              .replace('une ', '')} in this part, use similar words or synonyms.

            use the ${getlanguage(subject)} language.

            use at least one name in this list : ${getRandomElements(
              fakeNames,
              1,
            )}

            use at least one place in this list:  ${getRandomElements(
              fakePlaces,
              1,
            )}

            Add an african context to this, the use case or example is in The democratic republic of Congo ( don't mention this)

            Add 4 questions at the end to lead students into discovering the lesson title of today.
            Include in the end a paragraph, named Consigne giving them clues in how they could use the story / use case to discover the lesson title.

            find the story based on the below objectives or example
            `,
      userPrompt: `
            lesson title : ${lessonTitle}
            objectives: ${objectives}
            `,
      assistant: '',
    };
  },
  [FicheStep.ActivitePrincipaleTeacher]: ({
    situation,
    subject,
    classe,
    lessonTitle,
    objectives,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `
            Depending on the situation Add short instructions to form working groups and process the statement below.
            The first is about group formation
            then add 3 instructions that gradually lead to discovering, definition and showcasing or demonstrating the lesson of today (${lessonTitle}) based on the below statement
            answer in ${getlanguage(subject)} only.
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account
            The first 3 questions might use the references in the situation. The others should be more general and related to the lesson ${lessonTitle}.
            In complete disregard of the situation , add 2 questions that will lead to mastering the lesson ${lessonTitle}. some definitions, essential points , examples, etc. that will help the student understand more. max 100 words per question.
            for these questions refer to the objectives of the lesson (${objectives})

            1. Question 1 ( based on the situation to form groups and organize them for better situation understanding) 
            2. Question 2 ( based on the situation)
            3. Question 3 ( based on the situation)
            4. Question 4 ( not based on the situation)
            5. Question 5 ( not based on the situation)
            `,
      userPrompt: situation,
      assistant: `1. `,
    };
  },
  [FicheStep.ActivitePrincipaleStudent]: ({
    activitePrincipaleTeacher,
    subject,
    classe,
    lessonTitle,
    domain,
    situation,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `
          answer in ${getlanguage(subject)} language only.
          You are a ${getOption(
            classe || 5,
          )} pupil with age between ${getAgeRange(classe || 5)}.
            Give detailed answer. Don't draw illustration, say instead how to look for it on internet ( don't give faulty sources).
            Don't include links to unexisting images, when necessary put a table. also you can provide search instructions on google with good keywords.
            Be consise.
          `,
      userPrompt: `
      Answer each instruction below as a student, give details knowing the lesson title ${lessonTitle}, use reference to or draw real ${getCourseMaterials(
        subject,
        domain,
      )}. 

      Situation / Histoire / Cas :
      ${situation}

      Instructions : ${activitePrincipaleTeacher}

      
        1. answer to question 1
        2. answer to question 2
        3. answer to question 3
        ...

        Don't limit to references in the provided situation, add more contexts and explanations.
 
        ${getCourseMandatoryMaterials(subject, domain)
          ?.map((c) => `- ${c}`)
          .join('\n')}
          

    `,
      assistant: `1. `,
    };
  },
  [FicheStep.SyntheseTeacher]: ({
    objectives,
    subject,
    classe,
    domain,
    lessonTitle,
    contentOutline,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `
            based on the following objectif, establish a list of conept to be learned by a student to master ${lessonTitle} in ${subject}. 
            You want to establish a clear and undertandable summary of the lesson.  ${
              contentOutline
                ? `Based on the plan outline below, ${contentOutline}`
                : '( outline the plan of the summary as a list here max 5 items)'
            }


            answer in ${getlanguage(subject)} only.
            ${domain ? `keep in mind we are in the domain of ${domain}` : ''}
            keep answers very short and to the point (max 10 words per answer)
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account
            `,
      userPrompt: objectives,
      assistant: '1.',
    };
  },
  [FicheStep.SyntheseStudent]: ({
    syntheseTeacher,
    subject,
    classe,
    domain,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `
            answer in ${getlanguage(subject)} only.
            ${domain ? `keep in mind we are in the domain of ${domain}` : ''}
            Make answers very detailed, giving essential data. be concise  (500 words max per answer)
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account
            `,
      userPrompt: syntheseTeacher,
      assistant: '1.',
    };
  },
  [FicheStep.ActiviteControleApplicationTeacher]: ({
    lessonTitle,
    objectives,
    subject,
    classe,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `prepare 4 exercises to check understanding of the lesson 
      answer in ${getlanguage(subject)} only.
      keep them very short and to the point (max 15 words per exercise)
      You have pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account
      `,
      userPrompt: `
            lesson title: ${lessonTitle}
            objectives: ${objectives},
            `,
      assistant: '1.',
    };
  },
  [FicheStep.ActiviteControleApplicationStudent]: ({
    subject,
    activiteControleApplicationTeacher,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `answer in ${getlanguage(subject)} only.
      keep them very short and to the point (max 20 words per exercise)
      answer the following exercises`,
      userPrompt: activiteControleApplicationTeacher,
      assistant: '1.',
    };
  },
  [FicheStep.ActiviteControleResearchTeacher]: ({
    lessonTitle,
    subject,
    classe,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `answer in${getlanguage(subject)}.
      keep them very short and to the point (max 15 words per exercise)
      You have pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account
      `,
      userPrompt: `prepare two items related to the lesson ${lessonTitle} that students will have to research and present in class. Each item should be a question or a topic that will lead to a presentation of 5 minutes. `,
      assistant: '1.',
    };
  },
  [FicheStep.ActiviteControleResearchStudent]: ({
    activiteControleResearchTeacher,
    subject,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `answer in ${getlanguage(subject)} only.
      keep them very short and to the point (max 20 words per exercise)
      answer the following exercises`,
      userPrompt: activiteControleResearchTeacher,
      assistant: '1.',
    };
  },
  [FicheStep.ActiviteControleEvaluationTeacher]: ({
    lessonTitle,
    objectives,
    subject,
    classe,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `prepare 4 exercises to check understanding of the lesson 
      answer in ${getlanguage(subject)} only.
      keep them very short and to the point (max 15 words per exercise)
      You have pupils with age between ${getAgeRange(
        classe || 5,
      )}, take that into account
      `,
      userPrompt: `
            lesson title: ${lessonTitle}
            objectives: ${objectives},
            `,
      assistant: '1.',
    };
  },
  [FicheStep.ActiviteControleEvaluationStudent]: ({
    subject,
    activiteControleEvaluationTeacher,
  }: Fiche): PromptType => {
    return {
      systemPrompt: `answer in ${getlanguage(subject)} only.
      keep them very short and to the point (max 20 words per exercise)
      answer the following exercises`,
      userPrompt: activiteControleEvaluationTeacher,
      assistant: '1.',
    };
  },
};

export const getPromptMaternelle: Record<string, (fiche: Fiche) => PromptType> =
  {
    [FicheStep.Objectives]: ({
      subject,
      lessonTitle,
      areaOfLife,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            You are a teacher of ${subject}  preparing a lesson. Act and write like a teacher. with details on the lesson and not generic concepts.
            Give only the objectives in ${getlanguage(subject)}, nothing more.
            You have very young children in the class, take that into account.
            Start with : A la fin de cette lecon, l'eleve aura acquis les competences suivants :
            1.
            `,
        userPrompt: `
            establish a list of 3  objectives that should be met after the ${subject}  lesson ${lessonTitle} for us to know that a student is fully capable to apply what he learned in academic and real life. This should include a technical understanding of the subject.
            there will be at least one to understand how this lesson is linked with a real-life scenario in ${areaOfLife}
            `,
        assistant: ``,
      };
    },
    [FicheStep.RevisionTeacherRappel]: ({
      subject,
      previousLesson,
      classe,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            You are a teacher of ${subject}  preparing a lesson. Act and write like a teacher. with details on the lesson and not generic concepts.
            Reply only in ${getlanguage(subject)}, nothing more.
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
          classe || 5,
        )}, take that into account
            Start with : 1. 
            `,
        userPrompt: `
            give me 2 short questions to check if a pupil understood a ${subject} lesson on ${previousLesson}.
            `,
        assistant: '',
      };
    },
    [FicheStep.RevisionStudentRappel]: ({
      revisionTeacherRappel,
      subject,
      classe,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            You are a pupil  answering the following questions from your teacher. Add short answers (max 16 words) to these questions 
            Answer in ${getlanguage(subject)} only.
            You are ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
          classe || 5,
        )}, take that into account
            Start with : 1.
            `,
        userPrompt: revisionTeacherRappel,
        assistant: '',
      };
    },
    [FicheStep.RevisionTeacherMotivation]: ({
      subject,
      lessonTitle,
      situation,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            You are a teacher of ${subject}  preparing a lesson. Act and write like a teacher. with details on the lesson and not generic concepts.
            Reply only in ${getlanguage(subject)} no other language.
            You have very young children in the class, take that into account
            No introductory statement
            Start with : 1. 
            `,
        userPrompt: `
        list 2 didactic materials ( something that interact with senses, can be seen, heard, touched except videos) that you will use to motivate students to learn ${lessonTitle} ${
          situation ? `Reference : ${situation.split('\n')[0]}` : ''
        } in a ${subject} lesson. or will help him discover the lesson. for each option, give a short explanation (10 to 20 words) of how it will be used.
        Use an example that can be found in D.R Congo
            `,
        assistant: '',
      };
    },
    [FicheStep.RevisionStudentMotivation]: ({
      revisionTeacherMotivation,
      subject,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            You are a pupil answering presentend with the below information. provide an explanation on what you see or hear depending on the below information. Add short answers (max 16 words).
            You are very young, reply like a child.
            use only ${getlanguage(subject)} language
            Start with : 1.
            `,
        userPrompt: `${extractSearchTerm(
          revisionTeacherMotivation,
          regexMaterial,
        )}\n${extractSearchTerm(revisionTeacherMotivation, regexContent, 1)} `,
        assistant: '',
      };
    },
    [FicheStep.Situation]: ({
      subject,
      lessonTitle,
      revisionStudentMotivation,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            You  are the teacher of a class of pupils between 2 and 5 years old. Reply as the teacher ( institutrice )
            Make a  longer version of 1 of the points below. Choose the most relevant one.
            this should be a detailed list of instruction to help pupils achieve what's stated in the examples below.
            Use the pronouns "je" to for french replies or "I" for english replies to refere  to you as a techer.
            Don't put introductory statement, just the instructions.

            use the ${getlanguage(subject)} language only.
            use only 1 of the examples below

            Include in the end a paragraph, named Consigne giving them clues in how they could use the story / use case to discover the lesson title.

            find the story based on the below objectives or example
            `,
        userPrompt: `
            lesson title : ${lessonTitle}
            examples: 1. ${revisionStudentMotivation}
            `,
        assistant: '',
      };
    },
    [FicheStep.ActivitePrincipaleTeacher]: ({
      subject,
      lessonTitle,
      revisionStudentMotivation,
      objectives,
      situation,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            Depending on the situation Add short instructions or questions that will lead the pupils into understanding the lesson.
            then add 5 instructions that gradually lead to discovering, definition and showcasing or demonstrating the lesson of today (${lessonTitle}) based on the below statement
            answer in ${getlanguage(subject)} only.
            You have very young children in a nursery, take that into account
            The first 4 questions might use the references in the situation. The others should be more general and related to the lesson ${lessonTitle}.
            In complete disregard of the situation , add 2 questions that will lead to mastering the lesson ${lessonTitle}. some definitions, essential points , examples, etc. that will help the student understand more. max 100 words per question.
            for these questions refer to the objectives of the lesson (${objectives})

            1. Question 1 ( based on the situation to form groups and organize them for better situation understanding) 
            2. Question 2 ( based on the situation)
            3. Question 3 ( based on the situation)
            4. Question 4 ( based on the situation)
            5. Question 5 ( not based on the situation)
            6. Question 6 ( not based on the situation)
            `,
        userPrompt: `
        Motivation and usecase: ${revisionStudentMotivation}
        Situation: ${situation}
        `,
        assistant: `1. `,
      };
    },
    [FicheStep.ActivitePrincipaleStudent]: ({
      activitePrincipaleTeacher,
      subject,
      lessonTitle,
      domain,
      situation,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            answer in ${getlanguage(subject)} only language.
            You have very young children in a nursery class, take that into account
             Give detailed answer. Don't draw illustration, say instead how to look for it on internet ( don't give faulty sources).
              Don't include links to unexisting images, when necessary put a table. also you can provide search instructions on google with good keywords.
              Be consise.
              max 100 words per answer
            `,
        userPrompt: `
        Answer each instruction below as a pupil, give details knowing the lesson title ${lessonTitle}, put some very light explnation that a child can understand.
        use reference to or draw real ${getCourseMaterials(subject, domain)}. 
        Situation / Histoire / Cas :
        ${situation}

        Instructions :
        
        ${activitePrincipaleTeacher}

        Don't limit to references in the provided situation, add more contexts and explanations.
 
        ${getCourseMandatoryMaterials(subject, domain)
          ?.map((c) => `- ${c}`)
          .join('\n')}
        
        Start with : 1.
      `,
        assistant: ``,
      };
    },
    [FicheStep.SyntheseTeacher]: ({
      objectives,
      subject,
      classe,
      lessonTitle,
      domain,
      contentOutline,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            based on the following objectif, establish a list of conept to be learned by a student to master ${lessonTitle} in ${subject}. 
            You want to establish a clear and undertandable summary of the lesson.  ${
              contentOutline
                ? `Based on the plan outline below, ${contentOutline}`
                : '( outline the plan of the summary as a list here with a max of 5 points)'
            }

            
            answer in ${getlanguage(subject)}.
            ${domain ? `keep in mind we are in the domain of ${domain}` : ''}
            keep answers very short and to the point (max 10 words per answer)
            You have ${getOption(
              classe || 5,
            )} pupils with age between ${getAgeRange(
          classe || 5,
        )}, take that into account
        Start with : 1.
            `,
        userPrompt: objectives,
        assistant: '',
      };
    },
    [FicheStep.SyntheseStudent]: ({
      syntheseTeacher,
      subject,
      domain,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `
            answer in detail all questions asked below. Include things a child can undertand. value simplicity over anything. 
            answer in ${getlanguage(subject)}.
            ${domain ? `keep in mind we are in the domain of ${domain}` : ''}
            Make answers very detailed, giving essential data. be concise  (500 words max per answer)
            You have very young children in the class, take that into account
            Start with : 1.
            `,
        userPrompt: syntheseTeacher,
        assistant: '',
      };
    },
    [FicheStep.ActiviteControleApplicationTeacher]: ({
      lessonTitle,
      objectives,
      subject,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `prepare 2 creative exercises to check understanding of the lesson 
        answer in ${getlanguage(subject)}.
      keep them very short and to the point (max 15 words per exercise)
      You have very young children in the class, take that into account
      Start with : 1.
      `,
        userPrompt: `
            lesson title: ${lessonTitle}
            objectives: ${objectives},
            `,
        assistant: '',
      };
    },
    [FicheStep.ActiviteControleApplicationStudent]: ({
      subject,
      activiteControleApplicationTeacher,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `answer in ${getlanguage(subject)} only.
      keep them very short and to the point (max 20 words per exercise)
      answer the following exercises
      Start with : 1.
      `,
        userPrompt: activiteControleApplicationTeacher,
        assistant: '',
      };
    },
    [FicheStep.ActiviteControleEvaluationTeacher]: ({
      lessonTitle,
      objectives,
      subject,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `prepare 4 exercises to check understanding of the lesson 
        answer in ${getlanguage(subject)}.
      keep them very short and to the point (max 15 words per exercise)
      You have very young children in the class, take that into account
      Start with : 1.
      `,
        userPrompt: `
            lesson title: ${lessonTitle}
            objectives: ${objectives},
            `,
        assistant: '',
      };
    },
    [FicheStep.ActiviteControleEvaluationStudent]: ({
      subject,
      activiteControleEvaluationTeacher,
    }: Fiche): PromptType => {
      return {
        systemPrompt: `answer in ${getlanguage(subject)} only.
      keep them very short and to the point (max 20 words per exercise)
      answer the following exercises
      Start with : 1.
      `,
        userPrompt: activiteControleEvaluationTeacher,
        assistant: '',
      };
    },
  };

export const getPrompt = (fiche: Fiche) => {
  const { classe } = fiche;
  if (Number.parseInt(classe, 10) < 7) {
    return getPromptPrimaire;
  }
  if (Number.parseInt(classe, 10) < 13) {
    return getPromptSecondaire;
  }
  return getPromptMaternelle;
};

export const getSteps = (fiche) => {
  const { classe } = fiche;
  if (Number.parseInt(classe, 10) < 7) {
    return ficheStepsPrimaire;
  }
  if (Number.parseInt(classe, 10) < 13) {
    return ficheStepsSecondaire;
  }
  return ficheStepsMaternelle;
};
