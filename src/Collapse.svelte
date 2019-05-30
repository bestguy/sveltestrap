<script>
	import clsx from 'clsx';

	import { slide } from 'svelte/transition';

	export let isOpen = false;
	let className = '';
	export { className as class };
	export let navbar = false;
	let _wasOpen = isOpen;
	$: classes = clsx(
		className,
		// collapseClass,
		navbar && 'navbar-collapse',
	);

	let windowWidth = window.innerWidth;

	$: if (windowWidth >= 768 && navbar && _wasOpen === isOpen) {
		_wasOpen = isOpen;
		isOpen = true;
	} else if (windowWidth < 768) {
		isOpen = _wasOpen;
	}
</script>

<svelte:window bind:innerWidth="{windowWidth}" />

{#if isOpen}
	<div
		transition:slide
		on:introstart
		on:introend
		on:outrostart
		on:outroend
		class="{classes}"
	>
		<slot />
	</div>
{/if}
