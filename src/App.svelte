<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from './lib/game.svelte';
  import ScoreBar from './components/ScoreBar.svelte';
  import SortableList from './components/SortableList.svelte';
  import GameOverModal from './components/GameOverModal.svelte';

  let darkMode = $state(false);

  onMount(() => {
    game.init('history');
    darkMode =
      localStorage.getItem('darkMode') === 'true' ||
      (localStorage.getItem('darkMode') === null &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  $effect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  });
</script>

<div class="min-h-screen bg-white dark:bg-slate-950">
  <div class="mx-auto max-w-lg px-4 py-6">
    <header class="relative mb-6 text-center">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">History Quiz</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Sort the events from earliest to latest
      </p>
      <button
        onclick={() => (darkMode = !darkMode)}
        class="absolute right-0 top-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100
          dark:text-slate-400 dark:hover:bg-slate-800"
        aria-label="Toggle dark mode"
      >
        {#if darkMode}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        {/if}
      </button>
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
        By Clemens Fiedler
        ·
        <a href="https://github.com/clemensfiedler/history-quiz" class="underline">GitHub</a>
      </p>
    </footer>
  </div>
</div>
