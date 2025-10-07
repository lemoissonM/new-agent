export const regexMaterial = /\d+\.\s*(.+?)(?=\n|$)/;
export const regexContent = /\d+\.\s*.+?\n(.+?)(?=\n\d+\.|$)/s;

export function extractSearchTerm(text: string, regex: RegExp, groupIndex: number = 0): string {
  const match = text.match(regex);
  return match ? match[groupIndex] : '';
}