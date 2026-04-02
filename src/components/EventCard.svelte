<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import EraBadge from './EraBadge.svelte';
  import type { CardState } from '../lib/types';

  interface Props {
    card: CardState;
  }
  const { card }: Props = $props();

  const badge = $derived(
    'era' in card.event
      ? card.event.era
      : 'genre' in card.event && card.event.genre
        ? (card.event.genre as string).split(',')[0].trim()
        : '',
  );
</script>

<div
  in:fly={{ y: 40, duration: 300 }}
  data-id={card.event.id}
  data-frozen={card.frozen}
  class="select-none rounded-xl border p-4 shadow-sm transition-colors
    {card.frozen
    ? 'cursor-default border-green-400 bg-green-50 dark:bg-green-950'
    : 'cursor-grab border-slate-300 bg-white active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800'}"
>
  <div class="flex items-start gap-2">
    <span class="mt-0.5 shrink-0 text-slate-400">
      {#if card.frozen}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/></svg>
      {/if}
    </span>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-medium text-slate-800 dark:text-slate-100">{card.event.event}</p>
      {#if badge}
        <div class="mt-1">
          <EraBadge label={badge} />
        </div>
      {/if}
      {#if card.dateRevealed}
        <p transition:fade={{ duration: 200 }} class="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {card.event.date}
        </p>
      {/if}
    </div>
  </div>
</div>
