<script>
	import clsx from 'clsx';

	import { context } from './DropdownContext';

	let className = '';
	export { className as class };
	export let disabled = false;
	export let direction = 'down';
	export let group = false;
	export let isOpen = false;
	export let nav = false;
	export let active = false;
	export let addonType = false;
	export let size = '';
	export let toggle = undefined;
	export let inNavbar = false;
	export let setActiveFromChild = false;
	export let dropup = false;

	const validDirections = ['up', 'down', 'left', 'right'];

	if (validDirections.indexOf(direction) === -1) {
		throw new Error(`Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right'`);
	}

	$: classes = clsx(
		className,
		direction !== 'down' && `drop${direction}`,
		nav && active ? 'active' : false,
		// setActiveFromChild && subItemIsActive ? 'active' : false,
		{
			[`input-group-${addonType}`]: addonType,
			'btn-group': group,
			[`btn-group-${size}`]: !!size,
			dropdown: !group && !addonType,
			show: isOpen,
			'nav-item': nav
		},
	);

	$: {
		context.update(function () {
			return {
				toggle,
				isOpen,
				direction: (direction === 'down' && dropup) ? 'up' : direction,
				inNavbar,
			};
		});
	}

	function handleToggle() {
	}
</script>

{#if nav}
	<li class="{classes}">
		<slot />
	</li>
{:else}
	<div class="{classes}">
		<slot />
	</div>
{/if}
