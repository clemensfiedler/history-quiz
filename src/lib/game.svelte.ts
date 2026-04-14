import { loadEvents } from './data';
import { getRandomUnique, validateOrder } from './utils';
import type { CardState, GamePhase, QuizEvent, QuizType } from './types';

const LS_BEST_KEY = 'history-quiz-best';

function createGameState() {
  let cards = $state<CardState[]>([]);
  let points = $state(0);
  let bestScore = $state(parseInt(localStorage.getItem(LS_BEST_KEY) ?? '0', 10));
  let phase = $state<GamePhase>('loading');
  let quizType = $state<QuizType>('history');
  let usedIds = $state<Set<number>>(new Set());
  let allEvents = $state<QuizEvent[]>([]);

  const canSubmit = $derived(phase === 'playing' && cards.length >= 2);

  $effect.root(() => {
    $effect(() => {
      if (points > bestScore) {
        bestScore = points;
        localStorage.setItem(LS_BEST_KEY, String(bestScore));
      }
    });
  });

  async function init(type: QuizType = 'history') {
    phase = 'loading';
    quizType = type;
    usedIds = new Set();
    points = 0;
    cards = [];

    allEvents = await loadEvents(type);

    const [first, second] = getRandomUnique(allEvents, usedIds, 2);
    usedIds.add(first.id);
    usedIds.add(second.id);

    cards = [
      { event: first, frozen: true, dateRevealed: true },
      { event: second, frozen: false, dateRevealed: false },
    ];

    phase = 'playing';
  }

  function reorder(orderedIds: number[]) {
    const map = new Map(cards.map((c) => [c.event.id, c]));
    cards = orderedIds.map((id) => map.get(id)!);
  }

  function submit() {
    if (!canSubmit) return;

    if (validateOrder(cards)) {
      points += 1;
      // Freeze all current cards and reveal dates
      cards = cards.map((c) => ({ ...c, frozen: true, dateRevealed: true }));

      // Add a new unfrozen card
      const [next] = getRandomUnique(allEvents, usedIds, 1);
      usedIds.add(next.id);
      cards = [...cards, { event: next, frozen: false, dateRevealed: false }];
    } else {
      // Wrong — reveal all dates, sort into correct order, pause before game over
      cards = cards
        .map((c) => ({ ...c, dateRevealed: true }))
        .sort((a, b) => a.event.date_start - b.event.date_start);
      phase = 'mistake';
    }
  }

  async function switchQuiz(type: QuizType) {
    await init(type);
  }

  function confirm() {
    phase = 'gameover';
  }

  return {
    get cards() { return cards; },
    get points() { return points; },
    get bestScore() { return bestScore; },
    get phase() { return phase; },
    get quizType() { return quizType; },
    get canSubmit() { return canSubmit; },
    init,
    reorder,
    submit,
    confirm,
    switchQuiz,
  };
}

export const game = createGameState();
