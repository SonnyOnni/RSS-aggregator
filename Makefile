install: # Install dependencies
	npm ci

publish: # Publish npm package
	npm publish --dry-run

lint: # Run linter
	npx eslint .
