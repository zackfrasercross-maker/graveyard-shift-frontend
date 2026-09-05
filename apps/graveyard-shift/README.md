# Graveyard Shift

Responsive 5×4 PixiJS/Svelte production slice for the Graveyard Shift slot concept.

## Run the preview

From the repository root:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm --filter graveyard-shift dev
```

Open `http://localhost:3004/?preview=1`. The preview flag bypasses RGS authentication while
keeping the normal route available for the later server integration. Tap the green spin control
to run the reel-stop, fog, animated-win, and caretaker-reaction sequence.

Static desktop and portrait review renders are in `docs/previews/`. Rebuild them with:

```bash
apps/graveyard-shift/scripts/render-static-preview.sh
```

## Locked product decisions

| Item                      | Locked value                                      |
| ------------------------- | ------------------------------------------------- |
| Grid                      | 5 reels × 4 rows, cascading/tumbling presentation |
| Volatility target         | Very high                                         |
| Global maximum win        | 25,000× total bet                                 |
| Base multiplier ladder    | 1× → 2× → 3× → 5× → 10×                           |
| Boosted multiplier ladder | 2× → 3× → 5× → 10× → 25×                          |
| Overtime Ante             | 3× stake per spin                                 |
| Boosted Multiplier        | 10× stake per spin                                |
| Overtime Free Spins       | 100× feature purchase                             |
| Eternal Overtime          | 300× feature purchase                             |
| Secret Shift              | 500× feature purchase                             |
| Max Win or Zero           | 1,000× feature purchase                           |

## Math decisions that are intentionally not fabricated

The win evaluation model (ways, lines, or cluster), paytable, RTP target, reel/strip weights,
feature probabilities, free-spin counts, retriggers, and Max Win or Zero hit probability remain
open. They must be selected, simulated in the companion math repository, and approved before the
frontend event contract can be treated as production-ready.

## Runtime assets

The repository carries downscaled runtime sheets. The untouched 512–1024 px frame masters remain
in the master art pack outside this repository. To regenerate the runtime sheets from that pack:

```bash
apps/graveyard-shift/scripts/prepare-runtime-assets.sh
```

No Spine subscription or paid animation editor is required for the current frame-sheet route.
The supplied character rig pieces remain suitable for a future bone-rig pass if the project later
chooses Spine, Rive, or DragonBones.
