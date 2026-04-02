export type QuizType = 'history' | 'games';

export interface HistoryEvent {
  id: number;
  date_start: number;
  date_end: number;
  date: string;
  era: string;
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
