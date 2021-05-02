<script lang="ts">
  import {
    Button,
    Modal
  } from 'sveltestrap';
  let open = false;
  const toggle = () => (open = !open);
</script>

<div>
  <Button color="danger" on:click={toggle}>Open Modal</Button>
  <Modal body header="Modal title" isOpen={open} {toggle}>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </Modal>
</div>
