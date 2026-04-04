.PHONY: data

update-data:
	cd data && uv run --with pandas python prepare_json.py
