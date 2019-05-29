<script>
	import clsx from 'clsx';

	import { context } from './DropdownContext';

	let className = '';
	export { className as class };
	export let right = false;
	export let flip = true;
	export let persist = false;

	$: classes = clsx(
		className,
		'dropdown-menu',
		{
			'dropdown-menu-right': right,
			show: $context.isOpen,
		},
	);
</script>

<div class="{classes}">
	<slot />
</div>
