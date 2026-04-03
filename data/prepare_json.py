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


MONTH_NUM = {
    "january": 1, "february": 2, "march": 3, "april": 4,
    "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}


def compute_date_sort(row) -> float:
    """Return a fractional year for sub-year sorting when month/day info exists."""
    year = float(row["year_start"])
    date_lower = str(row["date"]).lower()
    for month_name, month_num in MONTH_NUM.items():
        if month_name in date_lower:
            after = date_lower[date_lower.index(month_name) + len(month_name):]
            day_match = re.search(r"^\s+(\d{1,2})\b", after)
            day = int(day_match.group(1)) if day_match else 15
            return round(year + (month_num - 1 + (day - 1) / 30.0) / 12.0, 4)
    return year


def classify_event(text: str) -> str:
    """Assign a broad event type from the event description."""
    t = text.lower()

    war = [
        "battle", "siege", "crusade", "invasion", "troops", "army",
        " war", "defeat", "uprising", "revolt", "combat", "massacre",
        "assassination", "armistice", "surrender", "blockade", "bombardment",
        "military campaign", "coup ",
    ]
    science = [
        "invent", "telescope", "steam engine", "electricity", "experiment",
        "vaccine", "nuclear", "computer", "spaceflight", "satellite",
        "calculus", "genetics", "evolution", "gravity", "relativity",
        " dna", "chemistry", "biology", "astronomy", "surgery",
        "calendar", "writing system", "domestication", "iron age",
        "bronze age", "agriculture", "gunpowder", "telephone", "airplane",
        "rocket", "mathematics", "papyrus", "cuneiform", "hieroglyph", "printing",
    ]
    exploration = [
        "voyage", "expedition", "circumnavigate", "trade route",
        "coloniz", "new world", "first european", "first contact",
    ]
    religion = [
        "church", "pope", "bishop", "monastery", "cathedral", "mosque",
        "temple", "islam", "christian", "buddhis", "hindu", " jewish",
        "religion", "faith", "theology", "protestant", "catholic",
        "reformation", "inquisition", "bible", "quran", "pilgrimage", "schism",
    ]
    culture = [
        "painting", "literature", "music", "poetry", "architecture",
        "sculpture", "novel", "theater", "symphony", "opera",
        "monument", "pyramid", "epic of gilgamesh", "stonehenge",
        "parthenon", "colosseum", "sistine", "construction begins",
    ]

    for kw in war:
        if kw in t:
            return "War & Conflict"
    for kw in science:
        if kw in t:
            return "Science & Technology"
    for kw in exploration:
        if kw in t:
            return "Exploration"
    for kw in religion:
        if kw in t:
            return "Religion"
    for kw in culture:
        if kw in t:
            return "Culture & Arts"
    return "Politics & Power"


# ── History events (from CSV) ───────────────────────────────────────────────
df = pd.read_csv(
    Path(__file__).parent / "events_prepared.csv", index_col=0
).reset_index(drop=True)
df["id"] = range(len(df))
df["date_sort"] = df.apply(compute_date_sort, axis=1)
# Use explicit type from CSV where set; auto-classify anything blank
if "type" not in df.columns:
    df["type"] = ""
df["type"] = df.apply(
    lambda r: r["type"] if pd.notna(r["type"]) and str(r["type"]).strip() else classify_event(r["event"]),
    axis=1,
)

history = df[["id", "year_start", "year_end", "date", "date_sort", "type", "event"]].copy()
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

extra_path = Path(__file__).parent / "games_extra.json"
if extra_path.exists():
    extra = json.loads(extra_path.read_text())
    for g in extra:
        g["id"] = len(games)
        games.append(g)
    print(f"Merged {len(extra)} extra game events from {extra_path.name}")

(OUT_DIR / "games.json").write_text(
    json.dumps(games, ensure_ascii=False, indent=2)
)
print(f"Wrote {len(games)} game events → {OUT_DIR / 'games.json'}")
