const generatedIds = new Set<number>();

export function generateUniqueSixDigitId(): number {
  let id: number;

  do {
    id = Math.floor(100000 + Math.random() * 900000); // Range: 100000–999999
  } while (generatedIds.has(id));

  generatedIds.add(id);
  return id;
}