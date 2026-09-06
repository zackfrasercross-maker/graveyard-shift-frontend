import { createLayout } from 'utils-layout';

export const { stateLayout, stateLayoutDerived } = createLayout({
	backgroundRatio: {
		normal: 1440 / 1080,
		portrait: 1080 / 1440,
	},
	mainSizesMap: {
		desktop: { width: 1440, height: 1080 },
		tablet: { width: 1440, height: 1080 },
		landscape: { width: 1440, height: 1080 },
		portrait: { width: 1080, height: 1440 },
	},
});
