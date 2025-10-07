export const fakeNames = [
  'Amina', 'Bakari', 'Chantal', 'Didier', 'Esperance', 'Faustin',
  'Grace', 'Henri', 'Immaculee', 'Jean', 'Kalima', 'Louise',
  'Marcel', 'Nadine', 'Olivier', 'Pascaline', 'Raphael', 'Sarah',
  'Thierry', 'Ursule', 'Victor', 'Wivine', 'Xavier', 'Yvette', 'Zola'
];

export const fakePlaces = [
  'Kinshasa', 'Goma', 'Lubumbashi', 'Bukavu', 'Kisangani',
  'Matadi', 'Kananga', 'Mbuji-Mayi', 'Kolwezi', 'Bandundu',
  'Mbandaka', 'Uvira', 'Butembo', 'Beni', 'Kalemie'
];

export const classes = [
  { id: '1', name: '1ère Maternelle', optionName: '', ageRange: '3-4', option: '15-20' },
  { id: '2', name: '2ème Maternelle', optionName: '', ageRange: '4-5', option: '15-20' },
  { id: '3', name: '3ème Maternelle', optionName: '', ageRange: '5-6', option: '15-20' },
  { id: '4', name: '1ère Primaire', optionName: '', ageRange: '6-7', option: '20-30' },
  { id: '5', name: '2ème Primaire', optionName: '', ageRange: '7-8', option: '20-30' },
  { id: '6', name: '3ème Primaire', optionName: '', ageRange: '8-9', option: '20-30' },
  { id: '7', name: '4ème Primaire', optionName: '', ageRange: '9-10', option: '25-35' },
  { id: '8', name: '5ème Primaire', optionName: '', ageRange: '10-11', option: '25-35' },
  { id: '9', name: '6ème Primaire', optionName: '', ageRange: '11-12', option: '25-35' },
  { id: '10', name: '1ère Secondaire', optionName: '', ageRange: '12-13', option: '30-40' },
  { id: '11', name: '2ème Secondaire', optionName: '', ageRange: '13-14', option: '30-40' },
  { id: '12', name: '3ème Secondaire', optionName: '', ageRange: '14-15', option: '30-40' },
  { id: '13', name: '4ème Secondaire', optionName: 'Sciences', ageRange: '15-16', option: '30-40' },
  { id: '14', name: '5ème Secondaire', optionName: 'Sciences', ageRange: '16-17', option: '30-40' },
  { id: '15', name: '6ème Secondaire', optionName: 'Sciences', ageRange: '17-18', option: '30-40' },
];

export function getRandomElements<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getLanguage(subject: string): string {
  const englishKeywords = ['english', 'anglais', 'anglai', 'kingereza', 'inglish'];
  return englishKeywords.includes(subject?.toLowerCase()) ? 'English' : 'French';
}

export function getAgeRange(classe: string): string {
  return classes.find((c) => classe.toString() === c.id?.toString())?.ageRange || '10-12';
}

export function getOption(classe: string): string {
  return classes.find((c) => classe.toString() === c.id?.toString())?.option || '20-30';
}

export function getClasse(classe: string): string {
  const c = classes.find((c) => classe.toString() === c.id?.toString());
  if (!c) return 'Unknown';
  return `${c.name} ${c.optionName}`.trim();
}