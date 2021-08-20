# imports
import pandas as pd
import json

# load dataset
events_combined = pd.read_csv('events_prepared.csv', index_col=0).reset_index(drop=True)

# save as json
results = events_combined.to_json(orient="records")
parsed = json.loads(results)
out = "const questionData = " + json.dumps(parsed, indent=4)

with open('events.js', 'w') as outfile:
    outfile.write(out)