<script lang="ts">
	import { EnablePixiExtension } from 'components-pixi';
	import { MainContainer } from 'components-layout';
	import { App, Rectangle } from 'pixi-svelte';

	import GraveyardScene from './GraveyardScene.svelte';
</script>

<App>
	<EnablePixiExtension />
	<Rectangle width={10000} height={10000} x={-5000} y={-5000} backgroundColor={0x020710} />
	<MainContainer>
		<GraveyardScene />
	</MainContainer>
</App>
