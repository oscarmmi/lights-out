Build Lights Out in THIS folder: C:\xampp\htdocs\lights-out

A recruiter-ready browser puzzle. Playable, polished, no backend.

## Game
- Call it "Grid Ember". Original neon tiles, no licensed branding.
- 5×5 grid. Click/tap a cell to toggle it and its orthogonal neighbors. Keyboard: arrows move a highlight, Enter/Space toggles. R shuffles a solvable board.
- Win when every cell is off. Moves counter. Local best (fewest moves) in localStorage.

## UI
- Dark board, glowing on-tiles, dim off-tiles. Not a default Vite page. No Vue logo.
- 390px phone and 1280px desktop.

## Tests
- Vitest (pure logic): toggling a center cell flips 5 cells; toggling a corner flips 3; an all-off board is a win; a shuffle is not already solved.
- `npm test` and `npm run build` must pass.

## GitHub
- Repo: https://github.com/oscarmmi/lights-out
- Pages: https://oscarmmi.github.io/lights-out/
- vite base `/lights-out/`
- Commit: feat: add lights out
- First commit must `git add -A` so package.json, vite.config.ts, tsconfigs, src/main.ts, index.html, .gitignore, and .github/workflows/pages.yml ship with the game.
- gh repo edit --description "Grid Ember lights-out puzzle in Vue 3 + TypeScript, playable on GitHub Pages." --add-topic vue --add-topic typescript --add-topic game --add-topic puzzle --add-topic lights-out
- Stop. Print the repo URL and Pages URL.
