# Graveyard Shift — Master Visual Asset Pack v1

This package is the production visual source set for the supplied **Graveyard Shift** concept. It preserves the approved dark-comedy cemetery direction, 5×4 reel geometry, tired caretaker identity, five-tier Shift Multiplier, and exact bottom-HUD hierarchy.

## Included

- Seven visual states: base, bonus, super, hidden bonus, ante, boosted multiplier, and max-win-or-zero.
- Desktop/web/mobile environment masters.
- 12 separate static symbols at 512 px and 256 px.
- 8-frame win loops for every symbol, with individual PNG frames, packed sheets, Pixi-compatible JSON, and GIF previews.
- Caretaker puppet pieces, rig/pivot JSON, an assembled idle, and two 8-frame character sequences.
- Exact 5×4 reel frame plus reel backdrops, masks, shadows and highlight overlays.
- Five-tier Shift Multiplier monument, separated regions, labels and active-state glows.
- Desktop and mobile HUD masters; menu, sound, settings, bet, autoplay, turbo and close controls; spin and buy-feature state sets.
- Bonus counters, feature cards, mode banners, win titles, menu/modal backplates, loading artwork and marketing artwork.
- Four transition-VFX sequences and six reusable particle fields.
- Seven assembled gameplay previews proving fit and hierarchy.

## Runtime rules

1. Do not bake player values into HUD art. BALANCE, BET, WIN, counters and multiplier values remain live text.
2. Use the 5×4 frame with a 1280×1024 logical reel viewport (256×256 cells) or the supplied 960×768 web scale.
3. Keep animation pivots fixed at cell centre unless a symbol-specific implementation calls for a bottom-centre anchor.
4. Play symbol win loops at 10 fps. Caretaker idle is 8 fps and loops; the feature reaction is a one-shot.
5. Preload base UI, base background, symbols and spin states before enabling play. Lazy-load bonus/super/risk backgrounds and VFX.
6. English display text is included, while blank value regions remain localization/currency safe.

## Important scope note

This is the complete **visual** production pack. Game math, event books, code, compliance copy and audio masters are separate production disciplines and are intentionally not faked inside an art ZIP. `integration/event_asset_map.json` provides the handoff contract for the frontend team.
