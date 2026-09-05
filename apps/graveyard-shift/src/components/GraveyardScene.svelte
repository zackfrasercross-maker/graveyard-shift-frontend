<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Container, Rectangle, Sprite, SpriteSheet, Text } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();
	const isPortrait = $derived(context.stateLayoutDerived.layoutType() === 'portrait');
	const motionReady = $derived(context.stateApp.loaded);

	type SymbolKey =
		| 'thermos'
		| 'shovel'
		| 'keys'
		| 'raven'
		| 'lantern'
		| 'checklist'
		| 'sleepyGhost'
		| 'blackCat'
		| 'tombstone'
		| 'caretakerSymbol'
		| 'wild'
		| 'scatter';
	type SpinPhase = 'idle' | 'spinning' | 'win';
	type SymbolGrid = SymbolKey[][];

	const initialRows: SymbolGrid = [
		['thermos', 'shovel', 'keys', 'raven', 'lantern'],
		['checklist', 'sleepyGhost', 'blackCat', 'tombstone', 'caretakerSymbol'],
		['raven', 'wild', 'shovel', 'thermos', 'tombstone'],
		['lantern', 'scatter', 'checklist', 'keys', 'blackCat'],
	];
	const resultRows: SymbolGrid = [
		['lantern', 'lantern', 'lantern', 'raven', 'keys'],
		['checklist', 'sleepyGhost', 'blackCat', 'tombstone', 'caretakerSymbol'],
		['raven', 'wild', 'shovel', 'thermos', 'tombstone'],
		['thermos', 'scatter', 'checklist', 'keys', 'blackCat'],
	];
	const symbolPool: SymbolKey[] = [
		'thermos',
		'shovel',
		'keys',
		'raven',
		'lantern',
		'checklist',
		'sleepyGhost',
		'blackCat',
		'tombstone',
		'caretakerSymbol',
		'wild',
		'scatter',
	];
	const winAssetKeyMap: Record<SymbolKey, string> = {
		thermos: 'thermosWin',
		shovel: 'shovelWin',
		keys: 'keysWin',
		raven: 'ravenWin',
		lantern: 'lanternWin',
		checklist: 'checklistWin',
		sleepyGhost: 'sleepyGhostWin',
		blackCat: 'blackCatWin',
		tombstone: 'tombstoneWin',
		caretakerSymbol: 'caretakerSymbolWin',
		wild: 'wildWin',
		scatter: 'scatterWin',
	};
	// The source canvases are identical, but their painted silhouettes are not.
	// Normalize the visible artwork so every symbol clears the smallest reel opening.
	const symbolScaleMap: Record<SymbolKey, number> = {
		thermos: 0.84,
		shovel: 0.8,
		keys: 0.8,
		raven: 0.81,
		lantern: 0.81,
		checklist: 0.8,
		sleepyGhost: 0.9,
		blackCat: 0.8,
		tombstone: 0.8,
		caretakerSymbol: 0.8,
		wild: 0.9,
		scatter: 0.9,
	};
	const symbolOpticalOffsetMap: Record<SymbolKey, { x: number; y: number }> = {
		thermos: { x: -2, y: -2 },
		shovel: { x: 0, y: 0 },
		keys: { x: 1, y: 0 },
		raven: { x: 1, y: -1 },
		lantern: { x: 0, y: 1 },
		checklist: { x: -1, y: 0 },
		sleepyGhost: { x: 4, y: -2 },
		blackCat: { x: 0, y: 0 },
		tombstone: { x: 0, y: 1 },
		caretakerSymbol: { x: 0, y: 1 },
		wild: { x: 3, y: 1 },
		scatter: { x: 3, y: 1 },
	};

	let visibleRows = $state<SymbolGrid>(initialRows.map((row) => [...row]));
	let spinPhase = $state<SpinPhase>('idle');
	let activeReels = $state([false, false, false, false, false]);
	let reelOffsets = $state([0, 0, 0, 0, 0]);
	let spinHovered = $state(false);
	let spinPressed = $state(false);
	let frameHandle: number | undefined;
	let winTimer: ReturnType<typeof setTimeout> | undefined;

	const reelStopTimes = [820, 980, 1140, 1300, 1460];
	const caretakerAnimationKey = $derived(
		spinPhase === 'win' ? 'caretakerFeatureReaction' : 'caretakerIdle',
	);
	const spinButtonKey = $derived.by(() => {
		if (!motionReady) return 'spinDisabled';
		if (spinPhase === 'spinning') return 'spinStop';
		if (spinPressed) return 'spinPressed';
		if (spinHovered) return 'spinHover';
		return 'spinIdle';
	});

	const finishSpin = () => {
		if (frameHandle !== undefined) cancelAnimationFrame(frameHandle);
		frameHandle = undefined;
		visibleRows = resultRows.map((row) => [...row]);
		activeReels = [false, false, false, false, false];
		reelOffsets = [0, 0, 0, 0, 0];
		spinPhase = 'win';

		if (winTimer !== undefined) clearTimeout(winTimer);
		winTimer = setTimeout(() => {
			spinPhase = 'idle';
		}, 2400);
	};

	const startSpin = () => {
		if (!motionReady) return;
		if (spinPhase === 'spinning') {
			finishSpin();
			return;
		}

		if (winTimer !== undefined) clearTimeout(winTimer);
		spinPhase = 'spinning';
		spinPressed = false;
		const startedAt = performance.now();
		let previousStep = -1;

		const tick = (now: number) => {
			const elapsed = now - startedAt;
			const step = Math.floor(elapsed / 72);
			const nextActiveReels = reelStopTimes.map((stopTime) => elapsed < stopTime);

			if (step !== previousStep) {
				visibleRows = initialRows.map((row, rowIndex) =>
					row.map((_, columnIndex) =>
						nextActiveReels[columnIndex]
							? symbolPool[(step * 3 + rowIndex * 5 + columnIndex * 7) % symbolPool.length]
							: resultRows[rowIndex][columnIndex],
					),
				);
				previousStep = step;
			}

			activeReels = nextActiveReels;
			reelOffsets = reelStopTimes.map((stopTime, columnIndex) => {
				if (elapsed < stopTime) return (elapsed * 1.55 + columnIndex * 31) % 164;
				const settleElapsed = elapsed - stopTime;
				if (settleElapsed >= 190) return 0;
				const settleRatio = settleElapsed / 190;
				return Math.sin(settleRatio * Math.PI) * 17 * (1 - settleRatio);
			});

			if (elapsed < reelStopTimes[reelStopTimes.length - 1] + 210) {
				frameHandle = requestAnimationFrame(tick);
			} else {
				finishSpin();
			}
		};

		frameHandle = requestAnimationFrame(tick);
	};

	const isWinningPosition = (rowIndex: number, columnIndex: number) =>
		spinPhase === 'win' && rowIndex === 0 && columnIndex < 3;

	const getSymbolY = (rowIndex: number, columnIndex: number) => {
		const baseY = frameRows[rowIndex];
		const offset = reelOffsets[columnIndex];
		if (!activeReels[columnIndex]) return (baseY + offset) * boardScale.y;
		const maskTop = 104;
		const maskHeight = 622;
		return (maskTop + ((baseY + offset - maskTop) % maskHeight)) * boardScale.y;
	};
	const getSymbolSize = (symbolKey: SymbolKey) =>
		scene.board.symbolSize * symbolScaleMap[symbolKey];
	const getSymbolX = (symbolKey: SymbolKey, columnIndex: number) =>
		frameColumns[columnIndex] * boardScale.x + symbolOpticalOffsetMap[symbolKey].x;
	const getOpticallyCenteredSymbolY = (
		symbolKey: SymbolKey,
		rowIndex: number,
		columnIndex: number,
	) => getSymbolY(rowIndex, columnIndex) + symbolOpticalOffsetMap[symbolKey].y;

	onDestroy(() => {
		if (frameHandle !== undefined) cancelAnimationFrame(frameHandle);
		if (winTimer !== undefined) clearTimeout(winTimer);
	});

	// The illustrated frame is intentionally organic, so these coordinates use the
	// visual centre of each opening instead of assuming perfectly even decoration.
	const frameColumns = [148.5, 316.4, 481.5, 645.2, 813.9];
	const frameRows = [179.5, 343, 505.9, 658];

	const scene = $derived(
		isPortrait
			? {
					width: 1080,
					height: 1920,
					backgroundKey: 'backgroundMobile',
					logo: { x: 540, y: 176, width: 900, height: 300 },
					caretaker: { x: 205, y: 1265, width: 330, height: 330 },
					multiplier: { x: 980, y: 680, width: 200, height: 450 },
					board: { x: 20, y: 340, width: 850, height: 680, symbolSize: 126 },
					hud: { x: 0, y: 1440, width: 1080, height: 480 },
					spin: { x: 510, y: 1791, size: 252 },
					values: [
						{ text: '€1,000.00', x: 194, y: 1551 },
						{ text: '€2.00', x: 540, y: 1551 },
						{ text: '€0.00', x: 880, y: 1551 },
					],
					valueFontSize: 34,
				}
			: {
					width: 1440,
					height: 1080,
					backgroundKey: 'backgroundDesktop',
					logo: { x: 720, y: 117, width: 740, height: 247 },
					caretaker: { x: 197, y: 651, width: 360, height: 360 },
					multiplier: { x: 1290, y: 565, width: 300, height: 680 },
					board: { x: 300, y: 225, width: 850, height: 680, symbolSize: 132 },
					hud: { x: 0, y: 900, width: 1440, height: 180 },
					spin: { x: 728, y: 990, size: 170 },
					values: [
						{ text: '€1,000.00', x: 289, y: 1028 },
						{ text: '€2.00', x: 524, y: 1028 },
						{ text: '€0.00', x: 948, y: 1028 },
					],
					valueFontSize: 24,
				},
	);

	const boardScale = $derived({
		x: scene.board.width / 960,
		y: scene.board.height / 768,
	});
</script>

<Sprite key={scene.backgroundKey} width={scene.width} height={scene.height} />

<Sprite
	key="logo"
	x={scene.logo.x}
	y={scene.logo.y}
	anchor={0.5}
	width={scene.logo.width}
	height={scene.logo.height}
/>

{#if motionReady}
	{#key caretakerAnimationKey}
		<SpriteSheet
			key={caretakerAnimationKey}
			x={scene.caretaker.x}
			y={scene.caretaker.y}
			anchor={0.5}
			width={scene.caretaker.width}
			height={scene.caretaker.height}
			animationSpeed={8 / 60}
			loop={caretakerAnimationKey === 'caretakerIdle'}
			play
		/>
	{/key}
{:else}
	<Sprite
		key="caretaker"
		x={scene.caretaker.x}
		y={scene.caretaker.y}
		anchor={0.5}
		width={scene.caretaker.width}
		height={scene.caretaker.height}
	/>
{/if}

<Sprite
	key="multiplierBase"
	x={scene.multiplier.x}
	y={scene.multiplier.y}
	anchor={0.5}
	width={scene.multiplier.width}
	height={scene.multiplier.height}
/>

<Container x={scene.board.x} y={scene.board.y}>
	<Rectangle
		x={58 * boardScale.x}
		y={94 * boardScale.y}
		width={846 * boardScale.x}
		height={642 * boardScale.y}
		backgroundColor={0x05090f}
	/>
	<Container>
		<Rectangle
			isMask
			x={58 * boardScale.x}
			y={94 * boardScale.y}
			width={846 * boardScale.x}
			height={642 * boardScale.y}
		/>

		{#each visibleRows as row, rowIndex}
			{#each row as symbolKey, columnIndex}
				{#if isWinningPosition(rowIndex, columnIndex)}
					<SpriteSheet
						key={winAssetKeyMap[symbolKey]}
						x={getSymbolX(symbolKey, columnIndex)}
						y={getOpticallyCenteredSymbolY(symbolKey, rowIndex, columnIndex)}
						anchor={0.5}
						width={getSymbolSize(symbolKey)}
						height={getSymbolSize(symbolKey)}
						animationSpeed={10 / 60}
						loop
						play
					/>
				{:else}
					<Sprite
						key={symbolKey}
						x={getSymbolX(symbolKey, columnIndex)}
						y={getOpticallyCenteredSymbolY(symbolKey, rowIndex, columnIndex)}
						anchor={0.5}
						width={getSymbolSize(symbolKey)}
						height={getSymbolSize(symbolKey)}
						alpha={spinPhase === 'spinning' && activeReels[columnIndex] ? 0.72 : 1}
					/>
				{/if}
			{/each}
		{/each}

		{#if spinPhase === 'spinning'}
			<SpriteSheet
				key="spinFog"
				x={scene.board.width / 2}
				y={scene.board.height / 2}
				anchor={0.5}
				width={scene.board.width * 0.92}
				height={scene.board.width * 0.92}
				alpha={0.48}
				animationSpeed={12 / 60}
				loop
				play
			/>
		{/if}
	</Container>

	<Sprite key="reelFrame" width={scene.board.width} height={scene.board.height} />
</Container>

<Sprite
	key={isPortrait ? 'hudMobile' : 'hudDesktop'}
	x={scene.hud.x}
	y={scene.hud.y}
	width={scene.hud.width}
	height={scene.hud.height}
/>

{#each scene.values as value}
	<Text
		text={value.text}
		x={value.x}
		y={value.y}
		anchor={0.5}
		style={{
			fontFamily: 'Arial, sans-serif',
			fontSize: scene.valueFontSize,
			fontWeight: '700',
			fill: 0xffffff,
			stroke: { color: 0x020710, width: 4 },
			dropShadow: {
				color: 0x000000,
				alpha: 0.8,
				blur: 3,
				distance: 2,
				angle: Math.PI / 2,
			},
		}}
	/>
{/each}

<Sprite
	key={spinButtonKey}
	x={scene.spin.x}
	y={scene.spin.y}
	anchor={0.5}
	width={scene.spin.size}
	height={scene.spin.size}
	eventMode="static"
	cursor={motionReady ? 'pointer' : 'wait'}
	onpointerover={() => (spinHovered = true)}
	onpointerout={() => {
		spinHovered = false;
		spinPressed = false;
	}}
	onpointerdown={() => (spinPressed = true)}
	onpointerup={() => {
		spinPressed = false;
		startSpin();
	}}
/>
