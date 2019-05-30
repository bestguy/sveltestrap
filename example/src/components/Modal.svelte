<script>
	import Button from '../../../src/Button.svelte';
	import Modal from '../../../src/Modal.svelte';
	import ModalHeader from '../../../src/ModalHeader.svelte';

	let isOpen = false;

	function toggle() {
		isOpen = !isOpen
	}
</script>

<Button on:click="{toggle}">Open Modal</Button>

<Modal {isOpen} {toggle}>
	<ModalHeader {toggle}>
		<div slot="content">Modal content</div>
	</ModalHeader>
</Modal>
