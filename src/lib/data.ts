import type { QuizEvent, QuizType } from './types';

const cache = new Map<QuizType, QuizEvent[]>();

export async function loadEvents(type: QuizType): Promise<QuizEvent[]> {
  if (cache.has(type)) return cache.get(type)!;

  const res = await fetch(`/data/${type === 'history' ? 'history' : 'games'}.json`);
  if (!res.ok) throw new Error(`Failed to load ${type} data: ${res.status}`);

  const events = (await res.json()) as QuizEvent[];
  cache.set(type, events);
  return events;
}
