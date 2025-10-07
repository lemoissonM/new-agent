export function getCourseMaterials(subject: string, domain?: string): string {
  const materials: Record<string, string> = {
    mathematics: 'geometric shapes, numbers, calculators, rulers',
    math: 'geometric shapes, numbers, calculators, rulers',
    mathématiques: 'formes géométriques, chiffres, calculatrices, règles',
    science: 'laboratory equipment, models, diagrams',
    sciences: 'équipement de laboratoire, modèles, diagrammes',
    geography: 'maps, globes, atlases',
    géographie: 'cartes, globes, atlas',
    history: 'timelines, historical documents, images',
    histoire: 'chronologies, documents historiques, images',
    french: 'books, texts, grammar charts',
    français: 'livres, textes, tableaux de grammaire',
    english: 'books, texts, vocabulary cards',
    anglais: 'livres, textes, cartes de vocabulaire',
  };

  return materials[subject.toLowerCase()] || 'didactic materials';
}

export function getCourseMandatoryMaterials(subject: string, domain?: string): string[] | undefined {
  const mandatoryMaterials: Record<string, string[]> = {
    mathematics: ['Include a table or diagram when relevant', 'Show step-by-step calculations'],
    math: ['Include a table or diagram when relevant', 'Show step-by-step calculations'],
    mathématiques: ['Inclure un tableau ou diagramme si pertinent', 'Montrer les calculs étape par étape'],
    science: ['Include diagrams or illustrations', 'Reference real-world examples'],
    sciences: ['Inclure des diagrammes ou illustrations', 'Référencer des exemples concrets'],
  };

  return mandatoryMaterials[subject.toLowerCase()];
}