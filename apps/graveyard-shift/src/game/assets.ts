const graveyard = (path: string) => new URL(`../../graveyard/${path}`, import.meta.url).href;
const symbolWinSheet = (symbolName: string) =>
	graveyard(`animations/symbols/${symbolName}/symbol_${symbolName}_win_sheet.json`);

export default {
	backgroundDesktop: {
		type: 'sprite',
		src: graveyard('backgrounds/base-desktop.webp'),
		preload: true,
	},
	backgroundMobile: {
		type: 'sprite',
		src: graveyard('backgrounds/base-mobile.webp'),
		preload: true,
	},
	logo: {
		type: 'sprite',
		src: graveyard('brand/logo.webp'),
		preload: true,
	},
	caretaker: {
		type: 'sprite',
		src: graveyard('character/caretaker.webp'),
		preload: true,
	},
	multiplierBase: {
		type: 'sprite',
		src: graveyard('multiplier/base.webp'),
		preload: true,
	},
	reelFrame: {
		type: 'sprite',
		src: graveyard('reels/frame.webp'),
		preload: true,
	},
	hudDesktop: {
		type: 'sprite',
		src: graveyard('hud/hud-desktop.webp'),
		preload: true,
	},
	hudMobile: {
		type: 'sprite',
		src: graveyard('hud/hud-mobile.webp'),
		preload: true,
	},
	thermos: {
		type: 'sprite',
		src: graveyard('symbols/symbol_thermos.png'),
		preload: true,
	},
	shovel: {
		type: 'sprite',
		src: graveyard('symbols/symbol_shovel.png'),
		preload: true,
	},
	keys: {
		type: 'sprite',
		src: graveyard('symbols/symbol_keys.png'),
		preload: true,
	},
	raven: {
		type: 'sprite',
		src: graveyard('symbols/symbol_raven.png'),
		preload: true,
	},
	lantern: {
		type: 'sprite',
		src: graveyard('symbols/symbol_lantern.png'),
		preload: true,
	},
	checklist: {
		type: 'sprite',
		src: graveyard('symbols/symbol_checklist.png'),
		preload: true,
	},
	sleepyGhost: {
		type: 'sprite',
		src: graveyard('symbols/symbol_sleepy_ghost.png'),
		preload: true,
	},
	blackCat: {
		type: 'sprite',
		src: graveyard('symbols/symbol_black_cat.png'),
		preload: true,
	},
	tombstone: {
		type: 'sprite',
		src: graveyard('symbols/symbol_tombstone.png'),
		preload: true,
	},
	caretakerSymbol: {
		type: 'sprite',
		src: graveyard('symbols/symbol_caretaker.png'),
		preload: true,
	},
	wild: {
		type: 'sprite',
		src: graveyard('symbols/symbol_wild.png'),
		preload: true,
	},
	scatter: {
		type: 'sprite',
		src: graveyard('symbols/symbol_scatter.png'),
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
		src: graveyard('animations/caretaker/idle/caretaker_idle_sheet.json'),
	},
	caretakerFeatureReaction: {
		type: 'spriteSheet',
		src: graveyard('animations/caretaker/feature-reaction/caretaker_feature_reaction_sheet.json'),
	},
	spinFog: {
		type: 'spriteSheet',
		src: graveyard('vfx/spin_fog/spin_fog_sheet.json'),
	},
	bonusGhost: {
		type: 'spriteSheet',
		src: graveyard('vfx/bonus_ghost/bonus_ghost_sheet.json'),
	},
	superEnergy: {
		type: 'spriteSheet',
		src: graveyard('vfx/super_energy/super_energy_sheet.json'),
	},
	maxzeroCollision: {
		type: 'spriteSheet',
		src: graveyard('vfx/maxzero_collision/maxzero_collision_sheet.json'),
	},
	spinIdle: {
		type: 'sprite',
		src: graveyard('hud/spin/spin_idle.png'),
		preload: true,
	},
	spinHover: {
		type: 'sprite',
		src: graveyard('hud/spin/spin_hover.png'),
		preload: true,
	},
	spinPressed: {
		type: 'sprite',
		src: graveyard('hud/spin/spin_pressed.png'),
		preload: true,
	},
	spinStop: {
		type: 'sprite',
		src: graveyard('hud/spin/spin_stop.png'),
		preload: true,
	},
	spinDisabled: {
		type: 'sprite',
		src: graveyard('hud/spin/spin_disabled.png'),
		preload: true,
	},
} as const;
