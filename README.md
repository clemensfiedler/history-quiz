# History Quiz

A drag-and-drop quiz where you sort historical events (and video game releases) from earliest to latest. Each correct round adds a new card to keep in order — how long can you go?

## Stack

- [Svelte 5](https://svelte.dev) (runes) + TypeScript
- [Vite 6](https://vitejs.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [SortableJS](https://sortablejs.github.io/Sortable/)

## Development

```bash
pnpm install
pnpm dev
```

## Data

Events are stored in `public/data/history.json` and `public/data/games.json`, generated from source files in `data/`:

```bash
cd data
uv run --with pandas python prepare_json.py
```
