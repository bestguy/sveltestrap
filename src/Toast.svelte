<script>
	import clsx from 'clsx';
	import { fade as fadeTrans } from 'svelte/transition';

	let className = '';
	export { className as class };
	export let fade = true;
	export let isOpen = true;

	$: classes = clsx(
		className,
		'toast',
		{
			show: isOpen,
		},
	);
</script>

{#if isOpen}
<div
	class="{classes}"
	transition:fadeTrans
	role="alert"
>
	<slot />
</div>
{/if}
