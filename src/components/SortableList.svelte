<script lang="ts">
  import Sortable from 'sortablejs';
  import type { CardState } from '../lib/types';
  import EventCard from './EventCard.svelte';
  import { game } from '../lib/game.svelte';

  interface Props {
    cards: CardState[];
  }
  const { cards }: Props = $props();

  function sortable(node: HTMLElement) {
    const instance = Sortable.create(node, {
      animation: 150,
      filter: '[data-frozen="true"]',
      onEnd() {
        const ids = [...node.querySelectorAll('[data-id]')].map((el) =>
          parseInt((el as HTMLElement).dataset.id!, 10),
        );
        game.reorder(ids);
      },
    });
    return {
      destroy() {
        instance.destroy();
      },
    };
  }
</script>

<div use:sortable class="flex flex-col gap-2">
  {#each cards as card (card.event.id)}
    <EventCard {card} />
  {/each}
</div>
