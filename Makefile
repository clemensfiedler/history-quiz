.PHONY: help update-data

help:
	@echo "update-data  Regenerate public/data/*.json from pipeline sources"

update-data:
	uv run python pipeline/prepare_json.py
