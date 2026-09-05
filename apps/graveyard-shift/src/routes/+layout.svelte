<script lang="ts">
	import { browser } from '$app/environment';
	import { type Snippet } from 'svelte';
	import { GlobalStyle } from 'components-ui-html';
	import { Authenticate, LoadI18n } from 'components-shared';

	import Game from '../components/Game.svelte';
	import { setContext } from '../game/context';
	import messagesMap from '../i18n/messagesMap';

	type Props = { children: Snippet };

	const props: Props = $props();
	const isPreview = browser && new URLSearchParams(window.location.search).get('preview') === '1';

	setContext();
</script>

<GlobalStyle>
	<LoadI18n {messagesMap}>
		{#if isPreview}
			<Game />
		{:else}
			<Authenticate>
				<Game />
			</Authenticate>
		{/if}
	</LoadI18n>
</GlobalStyle>

{@render props.children()}
