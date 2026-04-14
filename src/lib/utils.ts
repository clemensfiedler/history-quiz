import type { CardState } from './types';

/** Pick `count` unique items from `pool` that are not already in `usedIds`. */
export function getRandomUnique<T extends { id: number }>(
  pool: T[],
  usedIds: Set<number>,
  count: number,
): T[] {
  const available = pool.filter((e) => !usedIds.has(e.id));
  if (available.length < count) {
    throw new Error(`Not enough unused events (need ${count}, have ${available.length})`);
  }

  const results: T[] = [];
  while (results.length < count) {
    const idx = Math.floor(Math.random() * available.length);
    const item = available.splice(idx, 1)[0];
    results.push(item);
  }
  return results;
}

/** Returns true if all cards are in chronological order (date_start ascending). */
export function validateOrder(cards: CardState[]): boolean {
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].event.date_start < cards[i - 1].event.date_start) return false;
  }
  return true;
}
