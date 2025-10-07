import { classes } from '@/config/classes';

export function getLanguage(subject: string): string {
  const englishVariants = ['english', 'anglais', 'anglai', 'kingereza', 'inglish'];
  return englishVariants.includes(subject?.toLowerCase()) ? 'English' : 'French';
}

export function getAgeRange(classe: string): string | undefined {
  return classes.find((c) => classe.toString() === c.id?.toString())?.ageRange;
}

export function getOption(classe: string): string | undefined {
  return classes.find((c) => classe.toString() === c.id?.toString())?.option;
}

export function getClasse(classe: string): string {
  const c = classes.find((cl) => classe.toString() === cl.id?.toString());
  if (!c) return 'Unknown';
  return `${c.name} ${c.optionName || ''}`.trim();
}

export function extractSearchTerm(text: string, regex: RegExp, index: number = 0): string {
  const matches = text.match(regex);
  return matches?.[index] || '';
}

export const regexMaterial = /\d+\.\s*([^\n:]+)/g;
export const regexContent = /:\s*(.+)/g;