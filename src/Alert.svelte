<script>
	import { fade as fadeTransition } from 'svelte/transition';

	let clazz = '';
	export { clazz as class };
	export let color = 'success';
	export let closeClassName = '';
	export let closeAriaLabel = 'Close';
	export let isOpen = true;
	export let toggle = undefined;
	export let fade = true;

	$: classNames = `${clazz ? `${clazz} ` : ''}alert alert-${color}${toggle ? ` alert-dismissible` : ''}`;
	$: closeClassNames = `close${closeClassName ? ` ${closeClassName}`: ''}`;
</script>

{#if isOpen}
	<div
		transition:fadeTransition
		class="{classNames}"
		role="alert"
	>
		{#if toggle}
			<button type="button" class="{closeClassNames}" aria-label="{closeAriaLabel}" on:click="{toggle}">
				<span aria-hidden="true">&times;</span>
			</button>
		{/if}
		<slot />
	</div>
{/if}
