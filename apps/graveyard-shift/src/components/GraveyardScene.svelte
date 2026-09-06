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
	let panel = $state('');
	let betIndex = $state(3);
	const bets = [0.2, 0.5, 1, 2, 5, 10];
	let autoLeft = $state(0);
	let turbo = $state(false);
	let soundEnabled = $state(true);
	let selectedMode = $state('Base');
	const modeNames: Record<string, string> = { Bonus: 'bonus', Super: 'super', Hidden: 'hidden', Ante: 'ante', Boosted: 'boosted', 'Max or zero': 'maxzero' };
	const money = (value: number) => `€${value.toFixed(2)}`;
	const changeBet = (delta: number) => {
		if (spinPhase === 'idle' && autoLeft === 0) betIndex = Math.max(0, Math.min(bets.length - 1, betIndex + delta));
	};
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
			if (autoLeft > 0) { autoLeft -= 1; startSpin(); }
		}, turbo ? 400 : 2400);
	};

	const startSpin = () => {
		if (!motionReady) return;
		if (spinPhase === 'spinning') {
			autoLeft = 0;
			finishSpin();
			return;
		}

		if (winTimer !== undefined) clearTimeout(winTimer);
		spinPhase = 'spinning';
		spinPressed = false;
		const startedAt = performance.now();
		let previousStep = -1;

		const tick = (now: number) => {
			const elapsed = (now - startedAt) * (turbo ? 2.5 : 1);
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
					height: 1440,
					backgroundKey: 'backgroundMobile',
					logo: { x: 540, y: 176, width: 900, height: 300 },
					caretaker: { x: 215, y: 1060, width: 300, height: 300 },
					multiplier: { x: 975, y: 805, width: 200, height: 456 },
					board: { x: 0, y: 350, width: 880, height: 704, symbolSize: 153 },
					hud: { x: 20, y: 1100, width: 1040, height: 340 },
					spin: { x: 540, y: 1295, size: 180 },
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
					caretaker: { x: 160, y: 650, width: 620, height: 620 },
					multiplier: { x: 1295, y: 565, width: 280, height: 639 },
					board: { x: 290, y: 190, width: 870, height: 696, symbolSize: 150 },
					hud: { x: 0, y: 900, width: 1440, height: 180 },
					spin: { x: 728, y: 988, size: 150 },
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

<Sprite key={selectedMode === 'Base' || !motionReady ? scene.backgroundKey : `mode_${modeNames[selectedMode]}_${isPortrait ? 'mobile' : 'desktop'}`} width={scene.width} height={scene.height} />

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
{#each [10, 5, 3, 2, 1] as tier, index}
	<Sprite key={`multiplierLabel${tier}`} anchor={0.5}
		x={scene.multiplier.x}
		y={scene.multiplier.y - scene.multiplier.height / 2 + scene.multiplier.height * ([0.29, 0.399, 0.509, 0.618, 0.729][index])}
		width={scene.multiplier.width * 0.45}
		height={scene.multiplier.height * 0.16} />
{/each}

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

<!-- The master rail is intentionally blank; values and controls remain live. -->
<Sprite key={isPortrait ? 'hudMobile' : 'hudDesktop'} x={scene.hud.x} y={scene.hud.y} width={scene.hud.width} height={scene.hud.height} />

{#snippet button(label: string, x: number, y: number, width: number, action: () => void)}
	<Container {x} {y} eventMode="static" cursor="pointer" onpointertap={action}>
		<Rectangle {width} height={64} borderRadius={12} backgroundColor={0x172333} borderColor={0x9b8657} borderWidth={2} />
		<Text text={label} x={width / 2} y={32} anchor={0.5} style={{ fontFamily: 'Arial', fontSize: 22, fill: 0xffffff }} />
	</Container>
{/snippet}

{#each ['BALANCE', 'BET', 'WIN'] as label, index}
	{@const x = isPortrait ? [205, 540, 875][index] : [270, 510, 935][index]}
	{@const y = isPortrait ? 1160 : 981}
	<Sprite key={index === 0 ? 'panelBalance' : index === 1 ? 'panelBet' : 'panelWin'} x={x} y={y} anchor={0.5} width={index === 0 ? 210 : index === 1 ? 105 : 230} height={100} />
	<Text text={label} {x} y={y - 13} anchor={0.5} style={{ fontSize: 19, fill: 0xaab7c5 }} />
	<Text text={index === 0 ? '€1,000.00' : index === 1 ? money(bets[betIndex]) : '€0.00'} {x} y={y + 19} anchor={0.5} style={{ fontFamily: 'Arial', fontSize: 25, fontWeight: 'bold', fill: 0xffffff }} />
{/each}

{#snippet hudControl(key: string, x: number, y: number, size: number, action: () => void)}
	<Sprite {key} x={x} y={y} anchor={0.5} width={size} height={size} eventMode="static" cursor="pointer" onpointertap={action} />
{/snippet}
{@render hudControl('menuButton', isPortrait ? 55 : 55, isPortrait ? 1260 : 990, isPortrait ? 62 : 66, () => { autoLeft = 0; panel = 'Menu'; })}
{@render hudControl(soundEnabled ? 'soundOn' : 'soundOff', isPortrait ? 135 : 130, isPortrait ? 1260 : 990, isPortrait ? 62 : 66, () => { soundEnabled = !soundEnabled; panel = 'Sound'; })}
{@render hudControl('minusButton', isPortrait ? 370 : 398, isPortrait ? 1270 : 990, isPortrait ? 62 : 66, () => changeBet(-1))}
{@render hudControl('plusButton', isPortrait ? 660 : 625, isPortrait ? 1270 : 990, isPortrait ? 62 : 66, () => changeBet(1))}
{@render hudControl('buyFeatureIdle', isPortrait ? 835 : 1085, isPortrait ? 1260 : 990, isPortrait ? 170 : 155, () => { autoLeft = 0; panel = 'Features'; })}
{@render hudControl('settingsButton', isPortrait ? 1015 : 1380, isPortrait ? 1260 : 990, isPortrait ? 62 : 66, () => { panel = 'Settings'; })}
<Text text={`VISUAL PREVIEW · ${selectedMode} · No wallet or payouts${autoLeft ? ` · ${autoLeft} auto spins left` : ''}`} x={scene.width / 2} y={isPortrait ? 1400 : 1060} anchor={0.5} style={{ fontSize: isPortrait ? 23 : 18, fill: 0xb8c3d1 }} />

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

{#if panel}
	<Rectangle width={scene.width} height={scene.height} backgroundColor={0x000000} backgroundAlpha={0.8} eventMode="static" onpointertap={() => { panel = ''; }} />
	<Container x={(scene.width - 820) / 2} y={(scene.height - 640) / 2} eventMode="static" onpointertap={(event) => event.stopPropagation()}>
		<Rectangle width={820} height={640} backgroundColor={0x0b1420} borderColor={0x9b8657} borderWidth={3} borderRadius={24} />
		<Text text={panel} x={45} y={35} style={{ fontFamily: 'Georgia', fontSize: 38, fill: 0xefdaa1 }} />
		{@render button('CLOSE', 650, 30, 130, () => { panel = ''; })}
		{#if panel === 'Menu'}
			{#each ['Settings', 'Autoplay', 'Game info', 'Features', 'Sound'] as name, index}
				{@render button(name, 55, 125 + index * 88, 710, () => { panel = name; })}
			{/each}
		{:else if panel === 'Settings'}
			{@render button(turbo ? 'Turbo: ON' : 'Turbo: OFF', 55, 145, 710, () => { turbo = !turbo; })}
			{@render button('Autoplay options', 55, 240, 710, () => { panel = 'Autoplay'; })}
			<Text text="Settings affect the visual demonstration only." x={55} y={355} style={{ fontSize: 25, fill: 0xc3cedc }} />
		{:else if panel === 'Autoplay'}
			<Text text="Fixed demo sequence. No wagers or prizes." x={55} y={120} style={{ fontSize: 25, fill: 0xc3cedc }} />
			{#each [5, 10, 25] as count, index}
				{@render button(`${count} preview spins`, 55, 185 + index * 90, 710, () => { if (spinPhase === 'idle') { autoLeft = count - 1; panel = ''; startSpin(); } })}
			{/each}
			{@render button('Stop autoplay', 55, 475, 710, () => { autoLeft = 0; panel = ''; })}
		{:else if panel === 'Features'}
			<Text text="Select a visual mode. Feature purchases are not connected." x={45} y={110} style={{ fontSize: 23, fill: 0xc3cedc, wordWrap: true, wordWrapWidth: 730 }} />
			{#each ['Base', 'Bonus', 'Super', 'Hidden', 'Ante', 'Boosted', 'Max or zero'] as name, index}
				{@render button(name, 45 + (index % 2) * 370, 185 + Math.floor(index / 2) * 95, 350, () => { selectedMode = name; panel = ''; })}
			{/each}
		{:else if panel === 'Sound'}
			<Text text="No audio masters are installed in this pack.\nSound is unavailable in this preview.\n\nThe audio brief is not a playable soundtrack." x={55} y={160} style={{ fontSize: 27, fill: 0xc3cedc, wordWrap: true, wordWrapWidth: 710 }} />
		{:else}
			<Text text="Graveyard Shift · 5 × 4 visual demonstration\n\nSpin plays a fixed animation, not a real game result.\nBalance is a placeholder; no money is deducted.\n\nPaytable, RTP, feature costs and wallet play require\nthe validated math and RGS integration.\n\nSpace: spin/stop · Escape: close / stop autoplay" x={55} y={145} style={{ fontSize: 25, fill: 0xc3cedc, wordWrap: true, wordWrapWidth: 710 }} />
		{/if}
	</Container>
{/if}

<svelte:window onkeydown={(event) => {
	if (event.key === 'Escape') { panel = ''; autoLeft = 0; }
	if (event.code === 'Space' && !event.repeat && !panel) { event.preventDefault(); startSpin(); }
}} />
