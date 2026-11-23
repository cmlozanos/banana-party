# Banana Party — native refinement handoff

## Changes owned
- `src/game.js`: atmospheric jungle layers, native moon/stars, edge foliage and stratified platform materials, redraw on appearance event; exact existing platform collision rectangles preserved. Phaser boot deferred to fontReady.
- `src/player.js`: original recognizable monkey replaces the triangle inside the same 80×100 sprite/body envelope.
- `src/menu.js`, `src/ui.js`, `style.css`: shared school font, dark scene letterbox background.
- `game.bundle.js`: regenerated only with existing `node tools/build.cjs` (no kernel/cache writes).
- `tools/browser-check.cjs`: day/night screenshots; explicit canvas focus for keyboard test after Adult dialog (instrumentation confirmed key events otherwise target FAMILY-V2-SHELL). No production input or physics change.

## Checks
`make check` PASS (syntax, exact generated bundle, assets/cache isolation, one-way platforms, queued quick jump and pause reset). `SCREENSHOT_DIR="$PWD/docs/refinement" node tools/browser-check.cjs` PASS at 1280×800, 800×1280, 360×740, 740×360, including rotations, touch hold/release, keyboard, ten-minute gate, pause/resume and offline Home. Real Phaser route completes first mission and enters level 2. Day/night captures `banana-<width>-light.png` / `banana-<width>-dark.png`; tablet and short-landscape visually inspected. No 50-level completion claim.

## Scope and integration
Approved bounded native visual pass, 23 November 2026. Work directly in the shared checkout; no commit/push. No shared `family-v2/` or service-worker edits by this worker. Those diff entries belong to Main's propagated kit/cache revision. Pre-existing `.DS_Store` left untouched. No new engines, paid artwork, packages, antialiasing, postprocessing or shadow-map budgets. Existing normal-quality shadows remain optional; default light mode unchanged. Audio OFF on load, saves, unlocked choices, Home and educational lock behavior preserved.

School lettering uses the existing FamilyV2 font, not a substitute. Existing source-generated Canvas/3D text waits on fontReady (Banana now also defers initial Phaser construction). Theme getters have OS/light fallback; motion getters gate decorative animation, not physical movement or mission clocks. Main owns shared-kernel CSS/font/cache exact-copy verification.

## Evidence and limits
`check.txt` and `browser.txt` hold the executed native checks and Chromium 151.0.7922.34 browser results. Screenshots are bounded task evidence in this folder. `browser-first-failures.txt`, where present, preserves early diagnostic failures; it is not the final result. `git diff --check` passed for all four checkouts. No Chromium 95 download or execution; no physical old-tablet CPU/GPU, battery, native OS gestures or exhaustive level playthrough certification. Rendering samples are desktop observations only. No claim of photorealism or exhaustive visual audit.

A green model/build test is not substituted for browser interaction. Tests continue to exercise native inputs, educational pauses, audio, Home and offline reload. No physics tuning was introduced. The bounded pass stops after focused implementation and evidenced fixes rather than extending to every track.
