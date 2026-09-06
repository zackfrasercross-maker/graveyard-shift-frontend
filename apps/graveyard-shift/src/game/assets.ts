import { base } from '$app/paths';
const graveyard = (path: string) => `${base}/graveyard/${path}`;
const symbolWinSheet = (symbolName: string) =>
	graveyard(`05_symbols/animated/${symbolName}/symbol_${symbolName}_win_sheet.json`);

export default {
	...Object.fromEntries(['bonus', 'super', 'hidden', 'ante', 'boosted', 'maxzero'].flatMap((mode) => [
		[`mode_${mode}_desktop`, { type: 'sprite' as const, src: graveyard(`03_backgrounds/web/background_${mode}_1440x1080.png`) }],
		[`mode_${mode}_mobile`, { type: 'sprite' as const, src: graveyard(`03_backgrounds/mobile/background_${mode}_1080x1920.png`) }],
	])),
	backgroundDesktop: {
		type: 'sprite',
		src: graveyard('03_backgrounds/web/background_base_1440x1080.png'),
		preload: true,
	},
	backgroundMobile: {
		type: 'sprite',
		src: graveyard('03_backgrounds/mobile/background_base_1080x1920.png'),
		preload: true,
	},
	logo: {
		type: 'sprite',
		src: graveyard('02_brand/logo/graveyard_shift_logo_1200x400.png'),
		preload: true,
	},
	caretaker: {
		type: 'sprite',
		src: graveyard('06_character/caretaker_composite_idle.png'),
		preload: true,
	},
	multiplierBase: {
		type: 'sprite',
		src: graveyard('07_multiplier/multiplier_monument_blank_web.png'),
		preload: true,
	},
	reelFrame: {
		type: 'sprite',
		src: graveyard('04_reels/web/reel_frame_5x4_960x768.png'),
		preload: true,
	},
	hudDesktop: {
		type: 'sprite',
		src: graveyard('08_hud/desktop/hud_rail_full_width.png'),
		preload: true,
	},
	hudMobile: {
		type: 'sprite',
		src: graveyard('08_hud/mobile/hud_mobile_master_blank_1080x480.png'),
		preload: true,
	},
	thermos: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_thermos.png'),
		preload: true,
	},
	shovel: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_shovel.png'),
		preload: true,
	},
	keys: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_keys.png'),
		preload: true,
	},
	raven: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_raven.png'),
		preload: true,
	},
	lantern: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_lantern.png'),
		preload: true,
	},
	checklist: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_checklist.png'),
		preload: true,
	},
	sleepyGhost: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_sleepy_ghost.png'),
		preload: true,
	},
	blackCat: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_black_cat.png'),
		preload: true,
	},
	tombstone: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_tombstone.png'),
		preload: true,
	},
	caretakerSymbol: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_caretaker.png'),
		preload: true,
	},
	wild: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_wild.png'),
		preload: true,
	},
	scatter: {
		type: 'sprite',
		src: graveyard('05_symbols/static/web_256/symbol_scatter.png'),
		preload: true,
	},
	blackCatWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('black_cat'),
	},
	caretakerSymbolWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('caretaker'),
	},
	checklistWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('checklist'),
	},
	keysWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('keys'),
	},
	lanternWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('lantern'),
	},
	ravenWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('raven'),
	},
	scatterWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('scatter'),
	},
	shovelWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('shovel'),
	},
	sleepyGhostWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('sleepy_ghost'),
	},
	thermosWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('thermos'),
	},
	tombstoneWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('tombstone'),
	},
	wildWin: {
		type: 'spriteSheet',
		src: symbolWinSheet('wild'),
	},
	caretakerIdle: {
		type: 'spriteSheet',
		src: graveyard('06_character/animations/idle/caretaker_idle_sheet.json'),
	},
	caretakerFeatureReaction: {
		type: 'spriteSheet',
		src: graveyard('06_character/animations/feature_reaction/caretaker_feature_reaction_sheet.json'),
	},
	spinFog: {
		type: 'spriteSheet',
		src: graveyard('11_vfx/spin_fog/spin_fog_sheet.json'),
	},
	bonusGhost: {
		type: 'spriteSheet',
		src: graveyard('11_vfx/bonus_ghost/bonus_ghost_sheet.json'),
	},
	superEnergy: {
		type: 'spriteSheet',
		src: graveyard('11_vfx/super_energy/super_energy_sheet.json'),
	},
	maxzeroCollision: {
		type: 'spriteSheet',
		src: graveyard('11_vfx/maxzero_collision/maxzero_collision_sheet.json'),
	},
	spinIdle: {
		type: 'sprite',
		src: graveyard('08_hud/spin/spin_idle.png'),
		preload: true,
	},
	spinHover: {
		type: 'sprite',
		src: graveyard('08_hud/spin/spin_hover.png'),
		preload: true,
	},
	spinPressed: {
		type: 'sprite',
		src: graveyard('08_hud/spin/spin_pressed.png'),
		preload: true,
	},
	spinStop: {
		type: 'sprite',
		src: graveyard('08_hud/spin/spin_stop.png'),
		preload: true,
	},
	spinDisabled: {
		type: 'sprite',
		src: graveyard('08_hud/spin/spin_disabled.png'),
		preload: true,
	},
} as const;
