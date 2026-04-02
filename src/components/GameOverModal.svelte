<script lang="ts">
  import { scale } from 'svelte/transition';
  import { game } from '../lib/game.svelte';

  const message = $derived(() => {
    if (game.points >= 20) return 'Incredible! You\'re a history master! 🏆';
    if (game.points >= 10) return 'Great job! Keep it up! 🌟';
    if (game.points >= 5) return 'Nice run! You\'ll do better next time! 💪';
    return 'Better luck next time! 🎯';
  });
</script>

<!-- backdrop -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
  <div
    in:scale={{ duration: 300, start: 0.85 }}
    class="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl text-center dark:bg-slate-900"
  >
    <div class="mb-2 text-5xl">💀</div>
    <h2 class="mb-1 text-2xl font-bold text-slate-800 dark:text-slate-100">Game Over!</h2>
    <p class="mb-4 text-slate-500 dark:text-slate-400">{message()}</p>

    <div class="mb-6 grid grid-cols-2 gap-4">
      <div class="rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
        <p class="text-sm text-slate-500 dark:text-slate-400">Score</p>
        <p class="text-3xl font-bold text-slate-800 dark:text-slate-100">{game.points}</p>
      </div>
      <div class="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950">
        <p class="text-sm text-indigo-600 dark:text-indigo-400">Best</p>
        <p class="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{game.bestScore}</p>
      </div>
    </div>

    <button
      onclick={() => game.init(game.quizType)}
      class="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
    >
      Play Again
    </button>
  </div>
</div>
