export function getCourseMaterials(subject?: string, domain?: string): string {
  const materials: Record<string, string[]> = {
    mathematics: ['ruler', 'compass', 'calculator', 'geometric shapes', 'number charts'],
    science: ['microscope', 'test tubes', 'magnifying glass', 'thermometer', 'models'],
    geography: ['maps', 'globe', 'atlas', 'compass', 'charts'],
    history: ['timeline', 'historical documents', 'pictures', 'artifacts'],
    french: ['books', 'dictionaries', 'flashcards', 'posters'],
    english: ['books', 'dictionaries', 'flashcards', 'audio materials'],
  };

  const subjectKey = subject?.toLowerCase() || '';
  const domainKey = domain?.toLowerCase() || '';

  return materials[subjectKey] || materials[domainKey] || ['educational materials', 'visual aids', 'textbooks'];
}

export function getCourseMandatoryMaterials(subject?: string, domain?: string): string[] | undefined {
  const mandatoryMaterials: Record<string, string[]> = {
    mathematics: ['Include mathematical formulas and equations', 'Show step-by-step calculations'],
    science: ['Include scientific diagrams', 'Explain scientific processes'],
    geography: ['Reference specific locations', 'Include geographical features'],
  };

  const subjectKey = subject?.toLowerCase() || '';
  const domainKey = domain?.toLowerCase() || '';

  return mandatoryMaterials[subjectKey] || mandatoryMaterials[domainKey];
}