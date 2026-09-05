#!/usr/bin/env bash
set -euo pipefail

app_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
default_pack_root="$(cd "$app_root/../../../.." && pwd)/Graveyard_Shift_Master_Asset_Pack_v1"
pack_root="${GRAVEYARD_ASSET_PACK:-$default_pack_root}"
runtime_root="$app_root/static/graveyard"

if [[ ! -d "$pack_root" ]]; then
	echo "Asset pack not found: $pack_root" >&2
	exit 1
fi

convert_runtime_webp() {
	local source_file="$1"
	local target_file="$2"
	local geometry="${3:-}"

	mkdir -p "$(dirname "$target_file")"
	if [[ -n "$geometry" ]]; then
		convert "$source_file" -resize "$geometry" -strip -quality 88 -define webp:method=6 "$target_file"
	else
		convert "$source_file" -strip -quality 88 -define webp:method=6 "$target_file"
	fi
}

convert_runtime_webp \
	"$pack_root/03_backgrounds/web/background_base_1440x1080.png" \
	"$runtime_root/backgrounds/base-desktop.webp"
convert_runtime_webp \
	"$pack_root/03_backgrounds/mobile/background_base_1080x1920.png" \
	"$runtime_root/backgrounds/base-mobile.webp"
convert_runtime_webp \
	"$pack_root/02_brand/logo/graveyard_shift_logo_1200x400.png" \
	"$runtime_root/brand/logo.webp"
convert_runtime_webp \
	"$pack_root/06_character/caretaker_composite_idle.png" \
	"$runtime_root/character/caretaker.webp" \
	768x768
convert_runtime_webp \
	"$pack_root/07_multiplier/multiplier_monument_base_labeled.png" \
	"$runtime_root/multiplier/base.webp" \
	560x1300
convert_runtime_webp \
	"$pack_root/04_reels/web/reel_frame_5x4_960x768.png" \
	"$runtime_root/reels/frame.webp"
convert_runtime_webp \
	"$pack_root/08_hud/desktop/hud_master_blank_1440x180.png" \
	"$runtime_root/hud/hud-desktop.webp"
convert_runtime_webp \
	"$pack_root/08_hud/mobile/hud_mobile_master_blank_1080x480.png" \
	"$runtime_root/hud/hud-mobile.webp"

resize_sheet_and_json() {
	local source_png="$1"
	local source_json="$2"
	local target_directory="$3"
	local divisor="$4"
	local target_image_name="$(basename "${source_png%.png}").webp"
	local target_png="$target_directory/$target_image_name"
	local target_json="$target_directory/$(basename "$source_json")"

	mkdir -p "$target_directory"
	convert "$source_png" \
		-resize "$((100 / divisor))%" \
		-strip \
		-quality 88 \
		-define webp:method=6 \
		"$target_png"

	jq --argjson divisor "$divisor" --arg image "$(basename "$target_png")" '
		(
			.frames[].frame.x,
			.frames[].frame.y,
			.frames[].frame.w,
			.frames[].frame.h,
			.frames[].spriteSourceSize.x,
			.frames[].spriteSourceSize.y,
			.frames[].spriteSourceSize.w,
			.frames[].spriteSourceSize.h,
			.frames[].sourceSize.w,
			.frames[].sourceSize.h,
			.meta.size.w,
			.meta.size.h
		) |= (. / $divisor | floor)
		| .meta.image = $image
	' "$source_json" > "$target_json"
}

symbol_names=(
	black_cat
	caretaker
	checklist
	keys
	lantern
	raven
	scatter
	shovel
	sleepy_ghost
	thermos
	tombstone
	wild
)

for symbol_name in "${symbol_names[@]}"; do
	symbol_source="$pack_root/05_symbols/animated/$symbol_name"
	resize_sheet_and_json \
		"$symbol_source/symbol_${symbol_name}_win_sheet.png" \
		"$symbol_source/symbol_${symbol_name}_win_sheet.json" \
		"$runtime_root/animations/symbols/$symbol_name" \
		2
done

resize_sheet_and_json \
	"$pack_root/06_character/animations/idle/caretaker_idle_sheet.png" \
	"$pack_root/06_character/animations/idle/caretaker_idle_sheet.json" \
	"$runtime_root/animations/caretaker/idle" \
	2

resize_sheet_and_json \
	"$pack_root/06_character/animations/feature_reaction/caretaker_feature_reaction_sheet.png" \
	"$pack_root/06_character/animations/feature_reaction/caretaker_feature_reaction_sheet.json" \
	"$runtime_root/animations/caretaker/feature-reaction" \
	2

for effect_name in bonus_ghost maxzero_collision spin_fog super_energy; do
	effect_source="$pack_root/11_vfx/$effect_name"
	resize_sheet_and_json \
		"$effect_source/${effect_name}_sheet.png" \
		"$effect_source/${effect_name}_sheet.json" \
		"$runtime_root/vfx/$effect_name" \
		2
done

mkdir -p "$runtime_root/hud/spin"
for state_name in autoplay disabled hover idle pressed stop; do
	convert "$pack_root/08_hud/spin/spin_${state_name}.png" \
		-resize 256x256 \
		-strip \
		-define png:compression-level=9 \
		"$runtime_root/hud/spin/spin_${state_name}.png"
done

echo "Prepared runtime animation assets in $runtime_root"
