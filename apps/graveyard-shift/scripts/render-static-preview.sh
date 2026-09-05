#!/usr/bin/env bash
set -euo pipefail

app_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
asset_root="$app_root/static/graveyard"
preview_root="$app_root/docs/previews"
tmp_root="$(mktemp -d)"
trap 'rm -rf "$tmp_root"' EXIT

mkdir -p "$preview_root"

resize_asset() {
	local source_file="$1"
	local geometry="$2"
	local output_file="$3"
	convert "$source_file" -resize "${geometry}!" "$output_file"
}

composite_at() {
	local overlay_file="$1"
	local x="$2"
	local y="$3"
	local canvas_file="$4"
	local next_file="$tmp_root/composite-next.png"
	convert "$canvas_file" "$overlay_file" -geometry "+${x}+${y}" -composite "$next_file"
	mv "$next_file" "$canvas_file"
}

render_desktop() {
	local output_file="$preview_root/base-desktop.webp"
	local working_file="$tmp_root/base-desktop-working.png"
	convert "$asset_root/backgrounds/base-desktop.webp" "$working_file"

	resize_asset "$asset_root/brand/logo.webp" 740x247 "$tmp_root/logo-desktop.png"
	resize_asset "$asset_root/character/caretaker.webp" 360x360 "$tmp_root/caretaker-desktop.png"
	resize_asset "$asset_root/multiplier/base.webp" 258x599 "$tmp_root/multiplier-desktop.png"
	resize_asset "$asset_root/reels/frame.webp" 850x680 "$tmp_root/frame-desktop.png"
	resize_asset "$asset_root/hud/hud-desktop.webp" 1440x180 "$tmp_root/hud-desktop.png"

	composite_at "$tmp_root/logo-desktop.png" 350 -6 "$working_file"
	composite_at "$tmp_root/caretaker-desktop.png" 17 471 "$working_file"
	composite_at "$tmp_root/multiplier-desktop.png" 1155 228 "$working_file"
	convert "$working_file" -fill '#05090f' -draw 'rectangle 351,308 1101,876' "$tmp_root/desktop-playfield.png"
	mv "$tmp_root/desktop-playfield.png" "$working_file"

	local symbol_names=(
		thermos shovel keys raven lantern
		checklist sleepy_ghost black_cat tombstone caretaker
		raven wild shovel thermos tombstone
		lantern scatter checklist keys black_cat
	)
	local symbol_x=(365 514 660 805 955)
	local symbol_y=(318 463 607 742)
	local index=0

	for row in 0 1 2 3; do
		for column in 0 1 2 3 4; do
			local symbol_name="${symbol_names[$index]}"
			resize_asset \
				"$asset_root/symbols/symbol_${symbol_name}.png" \
				132x132 \
				"$tmp_root/symbol-${index}.png"
			composite_at \
				"$tmp_root/symbol-${index}.png" \
				"${symbol_x[$column]}" \
				"${symbol_y[$row]}" \
				"$working_file"
			index=$((index + 1))
		done
	done

	composite_at "$tmp_root/frame-desktop.png" 300 225 "$working_file"
	composite_at "$tmp_root/hud-desktop.png" 0 900 "$working_file"

	convert "$working_file" \
		-font DejaVu-Sans-Bold -fill white -stroke '#020710' -strokewidth 2 \
		-pointsize 24 -gravity northwest \
		-annotate +230+1041 '€1,000.00' \
		-annotate +489+1041 '€2.00' \
		-annotate +913+1041 '€0.00' \
		"$tmp_root/desktop-complete.png"
	convert "$tmp_root/desktop-complete.png" -strip -quality 88 -define webp:method=6 "$output_file"
}

render_portrait() {
	local output_file="$preview_root/base-portrait.webp"
	local working_file="$tmp_root/base-portrait-working.png"
	convert "$asset_root/backgrounds/base-mobile.webp" "$working_file"

	resize_asset "$asset_root/brand/logo.webp" 900x300 "$tmp_root/logo-portrait.png"
	resize_asset "$asset_root/character/caretaker.webp" 330x330 "$tmp_root/caretaker-portrait.png"
	resize_asset "$asset_root/multiplier/base.webp" 180x418 "$tmp_root/multiplier-portrait.png"
	resize_asset "$asset_root/reels/frame.webp" 1000x800 "$tmp_root/frame-portrait.png"
	resize_asset "$asset_root/hud/hud-mobile.webp" 1080x480 "$tmp_root/hud-portrait.png"

	composite_at "$tmp_root/logo-portrait.png" 90 26 "$working_file"
	composite_at "$tmp_root/caretaker-portrait.png" 40 1127 "$working_file"
	composite_at "$tmp_root/multiplier-portrait.png" 820 1056 "$working_file"
	convert "$working_file" -fill '#05090f' -draw 'rectangle 100,428 981,1097' "$tmp_root/portrait-playfield.png"
	mv "$tmp_root/portrait-playfield.png" "$working_file"

	local symbol_names=(
		thermos shovel keys raven lantern
		checklist sleepy_ghost black_cat tombstone caretaker
		raven wild shovel thermos tombstone
		lantern scatter checklist keys black_cat
	)
	local symbol_x=(119 294 466 636 811)
	local symbol_y=(441 611 781 940)
	local index=0

	for row in 0 1 2 3; do
		for column in 0 1 2 3 4; do
			local symbol_name="${symbol_names[$index]}"
			resize_asset \
				"$asset_root/symbols/symbol_${symbol_name}.png" \
				152x152 \
				"$tmp_root/portrait-symbol-${index}.png"
			composite_at \
				"$tmp_root/portrait-symbol-${index}.png" \
				"${symbol_x[$column]}" \
				"${symbol_y[$row]}" \
				"$working_file"
			index=$((index + 1))
		done
	done

	composite_at "$tmp_root/frame-portrait.png" 40 330 "$working_file"
	composite_at "$tmp_root/hud-portrait.png" 0 1440 "$working_file"

	convert "$working_file" \
		-font DejaVu-Sans-Bold -fill white -stroke '#020710' -strokewidth 2 \
		-pointsize 34 -gravity northwest \
		-annotate +115+1569 '€1,000.00' \
		-annotate +490+1569 '€2.00' \
		-annotate +830+1569 '€0.00' \
		"$tmp_root/portrait-complete.png"
	convert "$tmp_root/portrait-complete.png" -strip -quality 88 -define webp:method=6 "$output_file"
}

render_desktop
render_portrait

convert "$preview_root/base-desktop.webp" -resize 960x720 "$tmp_root/desktop-contact.png"
convert "$preview_root/base-portrait.webp" -resize 405x720 "$tmp_root/portrait-contact.png"
convert \
	"$tmp_root/desktop-contact.png" \
	"$tmp_root/portrait-contact.png" \
	-background '#06101d' -gravity center +append \
	-strip -quality 88 -define webp:method=6 \
	"$preview_root/base-responsive-contact-sheet.webp"

echo "Rendered previews to $preview_root"
