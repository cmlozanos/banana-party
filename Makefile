.PHONY: run help build check test icons

PORT ?= 8000
HOST ?= localhost

help:
	@echo "🍌 Banana Party - make run"

build:
	node tools/build.cjs

check:
	node tools/check.cjs

test:
	node tools/browser-check.cjs

icons:
	node tools/icons.cjs

run:
	@if command -v python3 > /dev/null 2>&1; then \
		python3 -m http.server $(PORT) --bind $(HOST); \
	elif command -v python > /dev/null 2>&1; then \
		python -m SimpleHTTPServer $(PORT); \
	elif command -v node > /dev/null 2>&1; then \
		npx -y http-server -p $(PORT) -a $(HOST); \
	else \
		echo "❌ Error: Instala Python 3 o Node.js"; \
		exit 1; \
	fi
