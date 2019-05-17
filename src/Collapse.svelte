<script>
	import { slide } from 'svelte/transition';

	export let isOpen = false;
</script>

{#if isOpen}
	<div
		transition:slide
		on:introstart
		on:introend
		on:outrostart
		on:outroend
	>
		<slot />
	</div>
{/if}
