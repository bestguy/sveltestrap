<script>
	import clsx from 'clsx';

	import { slide } from 'svelte/transition';

	export let isOpen = false;
	let className = '';
	export { className as class };
	export let navbar = false;

	$: classes = clsx(
		className,
		// collapseClass,
		navbar && 'navbar-collapse',
	);
</script>

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
