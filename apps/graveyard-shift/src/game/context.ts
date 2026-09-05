import { setContextLayout, getContextLayout } from 'utils-layout';
import { setContextApp, getContextApp } from 'pixi-svelte';

import { stateLayout, stateLayoutDerived } from './stateLayout';
import { stateApp } from './stateApp';

export const setContext = () => {
	setContextLayout({ stateLayout, stateLayoutDerived });
	setContextApp({ stateApp });
};

export const getContext = () => ({
	...getContextLayout(),
	...getContextApp(),
});
