<script lang="ts">
  interface Props {
    label: string;
  }
  const { label }: Props = $props();

  const colours: Record<string, string> = {
    'Ancient & Classical': 'bg-amber-700 text-amber-50',
    'Medieval': 'bg-green-800 text-green-50',
    'Early Modern': 'bg-sky-800 text-sky-50',
    'Modern': 'bg-purple-800 text-purple-50',
    'Contemporary': 'bg-indigo-800 text-indigo-50',
  };

  const colour = $derived(
    Object.entries(colours).find(([k]) => label.includes(k))?.[1] ??
      'bg-slate-600 text-slate-50',
  );
</script>

<span class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {colour}">
  {label}
</span>
