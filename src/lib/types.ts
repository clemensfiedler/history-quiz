export type QuizType = 'history' | 'games';
export type GamePhase = 'loading' | 'playing' | 'mistake' | 'gameover';

export interface HistoryEvent {
  id: number;
  date_start: number;
  date_end: number;
  date: string;
  date_sort: number;
  type: string;
  event: string;
}

export interface GameEvent {
  id: number;
  date_start: number;
  date_end: number;
  date: string;
  event: string;
  genre?: string;
  developer?: string;
  publisher?: string;
}

export type QuizEvent = HistoryEvent | GameEvent;

export interface CardState {
  event: QuizEvent;
  frozen: boolean;
  dateRevealed: boolean;
}
