"""
Prepare JSON data files for the History Quiz app.
Outputs:
  ../public/data/history.json  — history events from CSV
  ../public/data/games.json    — video game events extracted from events.js
"""
import json
import re
from pathlib import Path

import pandas as pd

OUT_DIR = Path(__file__).parent.parent / "public" / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ── History events (from CSV) ───────────────────────────────────────────────
df = pd.read_csv(
    Path(__file__).parent / "events_prepared.csv", index_col=0
).reset_index(drop=True)
df["id"] = range(len(df))

history = df[["id", "year_start", "year_end", "date", "era", "event"]].copy()
history = history.rename(columns={"year_start": "date_start", "year_end": "date_end"})
history["date_start"] = history["date_start"].astype(int)
history["date_end"] = history["date_end"].astype(int)

history_records = json.loads(history.to_json(orient="records"))
(OUT_DIR / "history.json").write_text(
    json.dumps(history_records, ensure_ascii=False, indent=2)
)
print(f"Wrote {len(history_records)} history events → {OUT_DIR / 'history.json'}")

# ── Games events (extracted from events.js) ─────────────────────────────────
js_text = (Path(__file__).parent / "events.js").read_text()

# Find the start of the games questions array via bracket counting
games_section_start = js_text.index("'games':")
questions_key = "'questions': ["
questions_start = js_text.index(questions_key, games_section_start) + len(questions_key) - 1

depth = 0
i = questions_start
in_string = False
escape_next = False
while i < len(js_text):
    ch = js_text[i]
    if escape_next:
        escape_next = False
    elif ch == "\\" and in_string:
        escape_next = True
    elif ch == '"' and not in_string:
        in_string = True
    elif ch == '"' and in_string:
        in_string = False
    elif not in_string:
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                break
    i += 1

games = json.loads(js_text[questions_start : i + 1])

# Normalise field names
for idx, g in enumerate(games):
    g["id"] = idx
    if "Genre(s)" in g:
        g["genre"] = g.pop("Genre(s)")
    if "Developer" in g:
        g["developer"] = g.pop("Developer")
    if "Publisher" in g:
        g["publisher"] = g.pop("Publisher")
    g.pop("Operating system(s)", None)

(OUT_DIR / "games.json").write_text(
    json.dumps(games, ensure_ascii=False, indent=2)
)
print(f"Wrote {len(games)} game events → {OUT_DIR / 'games.json'}")
