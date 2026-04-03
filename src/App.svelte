<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from './lib/game.svelte';
  import ScoreBar from './components/ScoreBar.svelte';
  import SortableList from './components/SortableList.svelte';
  import GameOverModal from './components/GameOverModal.svelte';

  onMount(() => {
    game.init('history');
  });
</script>

<div class="mx-auto min-h-screen max-w-lg px-4 py-6">
  <header class="mb-6 text-center">
    <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">History Quiz</h1>
    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Sort the events from earliest to latest
    </p>
  </header>

  <ScoreBar />

  <div class="my-5">
    {#if game.phase === 'loading'}
      <div class="flex justify-center py-16">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    {:else}
      <SortableList cards={game.cards} />
    {/if}
  </div>

  {#if game.phase === 'playing'}
    <button
      onclick={() => game.submit()}
      disabled={!game.canSubmit}
      class="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors
        hover:bg-indigo-700 active:bg-indigo-800
        disabled:cursor-not-allowed disabled:opacity-40"
    >
      Submit Order
    </button>
  {/if}

  {#if game.phase === 'mistake'}
    <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-950">
      <p class="mb-1 font-semibold text-red-700 dark:text-red-300">Wrong order!</p>
      <p class="mb-3 text-sm text-red-600 dark:text-red-400">The correct arrangement is shown above.</p>
      <button
        onclick={() => game.confirm()}
        class="rounded-xl bg-red-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800"
      >
        See Score
      </button>
    </div>
  {/if}

  {#if game.phase === 'gameover'}
    <GameOverModal />
  {/if}

  <footer class="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-700">
    <p>Source: Wikipedia</p>
    <p class="mt-1">
      By <a href="mailto:clemens.mb.fiedler@gmail.com" class="underline">Clemens Fiedler</a>
      ·
      <a href="https://github.com/clemensfiedler/history-quiz" class="underline">GitHub</a>
    </p>
  </footer>
</div>
