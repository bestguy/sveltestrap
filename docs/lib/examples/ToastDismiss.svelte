<script>
	import { Button, Toast, ToastBody, ToastHeader } from 'sveltestrap';

	export let buttonLabel;

	let isOpen = false;

	function toggle() {
		isOpen = !isOpen
	}
</script>

<Button color="primary" on:click={toggle}>{buttonLabel}</Button>
<br />
<br />
<Toast {isOpen}>
	<ToastHeader toggle="{toggle}">Toast title</ToastHeader>
	<ToastBody>
		Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	</ToastBody>
</Toast>
