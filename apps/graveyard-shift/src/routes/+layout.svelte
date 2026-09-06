<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { type Snippet } from 'svelte';
	import Authenticate from 'components-shared/src/components/Authenticate.svelte';
	import LoadI18n from 'components-shared/src/components/LoadI18n.svelte';

	import '../app.css';

	import Game from '../components/Game.svelte';
	import { setContext } from '../game/context';
	import messagesMap from '../i18n/messagesMap';

	type Props = { children: Snippet };

	const props: Props = $props();
	const isPreview = browser && (new URLSearchParams(window.location.search).get('preview') === '1' || (dev && !new URLSearchParams(window.location.search).has('rgs_url')));

	setContext();
</script>

<LoadI18n {messagesMap}>
	{#if isPreview}
		<Game />
	{:else}
		<Authenticate>
			<Game />
		</Authenticate>
	{/if}
</LoadI18n>

{@render props.children()}
