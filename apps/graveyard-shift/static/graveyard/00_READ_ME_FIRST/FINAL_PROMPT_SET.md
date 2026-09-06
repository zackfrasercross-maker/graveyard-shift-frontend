# Generation prompt architecture

All generated images followed one consistent production brief:

- **Identity anchor:** the supplied Graveyard Shift concept image.
- **Medium:** premium stylized 3D-painted slot art with tactile stone, wood, iron, fabric and brass.
- **Palette:** moonlit navy with warm amber practical light; controlled violet, toxic-green, teal or crimson/cyan mode accents.
- **Layout invariants:** 4:3 desktop composition; central 5×4 reel reserve; caretaker area left; multiplier area right; HUD reserve at bottom.
- **Asset isolation:** one object or sequential animation per grid cell, clear gutters, fixed scale and virtual camera.
- **Avoid:** sample-game art, watermarks, baked values, cropped silhouettes, duplicate symbols, uncontrolled glow, flat-vector rendering and scene/UI contamination.

Specialized prompts then named the exact symbol, animation action, mode lighting, UI component state, or VFX sequence. Exact visible phrases were quoted verbatim. This file summarizes the final prompt set; the semantic asset inventory in `ASSET_CATALOG.csv` is authoritative for implementation.
