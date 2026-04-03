<script lang="ts">
  interface Props {
    label: string;
  }
  const { label }: Props = $props();

  const colours: Record<string, string> = {
    'War & Conflict':       'bg-red-700 text-red-50',
    'Science & Technology': 'bg-blue-700 text-blue-50',
    'Exploration':          'bg-teal-700 text-teal-50',
    'Religion':             'bg-purple-700 text-purple-50',
    'Culture & Arts':       'bg-amber-600 text-amber-50',
    'Politics & Power':     'bg-slate-600 text-slate-50',
    // game genres (fallback colours by first word)
    'Action':               'bg-orange-600 text-orange-50',
    'RPG':                  'bg-indigo-600 text-indigo-50',
    'Racing':               'bg-cyan-600 text-cyan-50',
    'Strategy':             'bg-green-700 text-green-50',
    'Adventure':            'bg-rose-600 text-rose-50',
    'Simulation':           'bg-sky-600 text-sky-50',
    'Sports':               'bg-lime-600 text-lime-50',
    'Fighting':             'bg-red-600 text-red-50',
    'Puzzle':               'bg-violet-600 text-violet-50',
    'Survival':             'bg-emerald-700 text-emerald-50',
  };

  const colour = $derived(
    Object.entries(colours).find(([k]) => label.includes(k))?.[1] ??
      'bg-slate-500 text-slate-50',
  );
</script>

<span class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {colour}">
  {label}
</span>
