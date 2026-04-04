# History Quiz

A drag-and-drop quiz where you sort historical events (and video game releases) from earliest to latest. Each correct round adds a new card to keep in order — how long can you go?

## Stack

- [Svelte 5](https://svelte.dev) (runes) + TypeScript
- [Vite 6](https://vitejs.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [SortableJS](https://sortablejs.github.io/Sortable/)

## Prerequisites

- [pnpm](https://pnpm.io) — JavaScript package manager
- [uv](https://docs.astral.sh/uv/) — Python package manager (for data pipeline only)

## Development

```bash
pnpm install
pnpm dev        # dev server at http://localhost:5173
pnpm build      # production build → dist/
pnpm check      # TypeScript + Svelte type checking
```

## Data pipeline

Events are stored in `public/data/history.json` and `public/data/games.json`, generated from source files in `pipeline/`:

| File | Description |
|---|---|
| `events_prepared.csv` | History events (date, description, era, type) |
| `events.js` | Video game release data |
| `games_extra.json` | Additional recent game releases |

Regenerate the JSON after editing any source file:

```bash
make update-data
```

Run `make help` to list all available targets.
