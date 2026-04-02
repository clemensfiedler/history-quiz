<script lang="ts">
  import { game } from '../lib/game.svelte';
  import type { QuizType } from '../lib/types';

  const quizOptions: { type: QuizType; label: string }[] = [
    { type: 'history', label: 'History' },
    { type: 'games', label: 'Video Games' },
  ];
</script>

<div class="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
  <div class="flex items-center gap-4">
    <div class="text-sm">
      <span class="text-slate-500 dark:text-slate-400">Points: </span>
      <span class="text-lg font-bold text-slate-800 dark:text-slate-100">{game.points}</span>
    </div>
    <div class="text-sm">
      <span class="text-slate-500 dark:text-slate-400">Best: </span>
      <span class="font-semibold text-slate-700 dark:text-slate-300">{game.bestScore}</span>
    </div>
  </div>

  <div class="flex rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900">
    {#each quizOptions as opt}
      <button
        onclick={() => game.switchQuiz(opt.type)}
        class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
          {game.quizType === opt.type
          ? 'bg-indigo-600 text-white'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}"
      >
        {opt.label}
      </button>
    {/each}
  </div>
</div>
