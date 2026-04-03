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

/** Returns the best available sort key for an event (sub-year precision when available). */
export function sortKey(event: CardState['event']): number {
  return 'date_sort' in event ? event.date_sort : event.date_start;
}

/** Returns true if all cards are in chronological order. */
export function validateOrder(cards: CardState[]): boolean {
  for (let i = 1; i < cards.length; i++) {
    if (sortKey(cards[i].event) < sortKey(cards[i - 1].event)) return false;
  }
  return true;
}
