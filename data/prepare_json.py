# imports
import pandas as pd
import json
from datetime import datetime as dt

# load dataset
events_combined = pd.read_csv('events_prepared.csv', index_col=0).reset_index(drop=True)
events_combined['id'] = range(len(events_combined))

# add header
header = f'const questionDate = "{dt.today().isoformat()}"\n'
header += f'const questionNumber = {len(events_combined)}\n'


# save as json
results = events_combined.to_json(orient="records")
parsed = json.loads(results)
out = header + "const questionData = " + json.dumps(parsed, indent=4)

with open('events.js', 'w') as outfile:
    outfile.write(out)