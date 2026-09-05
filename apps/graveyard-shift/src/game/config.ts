/**
 * Product-level values that are safe to lock before math certification.
 * Probability, paytable, reel-weight, RTP, and feature-frequency fields stay null on purpose.
 */
export default {
	providerName: 'buzzltd',
	gameName: 'Graveyard Shift',
	gameID: 'graveyard_shift',
	grid: {
		reels: 5,
		rows: 4,
		presentation: 'cascade',
	},
	volatility: 'very-high',
	globalMaxWin: 25000,
	payoutModel: null,
	rtp: null,
	multiplierLadders: {
		base: [1, 2, 3, 5, 10],
		boosted: [2, 3, 5, 10, 25],
	},
	betModes: {
		base: {
			cost: 1,
			kind: 'standard-spin',
		},
		overtimeAnte: {
			cost: 3,
			kind: 'enhanced-spin',
		},
		boostedMultiplier: {
			cost: 10,
			kind: 'enhanced-spin',
		},
		overtimeFreeSpins: {
			cost: 100,
			kind: 'feature-buy',
		},
		eternalOvertime: {
			cost: 300,
			kind: 'feature-buy',
		},
		secretShift: {
			cost: 500,
			kind: 'feature-buy',
		},
		maxWinOrZero: {
			cost: 1000,
			kind: 'feature-buy',
		},
	},
	symbols: {
		thermos: { paytable: null },
		shovel: { paytable: null },
		keys: { paytable: null },
		raven: { paytable: null },
		lantern: { paytable: null },
		checklist: { paytable: null },
		sleepyGhost: { paytable: null },
		blackCat: { paytable: null },
		tombstone: { paytable: null },
		caretaker: { paytable: null },
		wild: { paytable: null, specialProperties: ['wild'] },
		scatter: { paytable: null, specialProperties: ['scatter'] },
	},
	math: {
		status: 'awaiting-model-selection',
		paytable: null,
		reelWeights: null,
		featureProbabilities: null,
		freeSpinCounts: null,
		retriggerRules: null,
		maxWinOrZeroHitProbability: null,
	},
} as const;
