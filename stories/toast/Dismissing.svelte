<script lang="typescript">
  import { Button, Toast, ToastBody, ToastHeader } from 'sveltestrap';

  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<Button color="primary" on:click={toggle} class="mb-3">Toggle Toast</Button>

<Toast {isOpen}>
  <ToastHeader {toggle}>Toast title</ToastHeader>
  <ToastBody>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
  </ToastBody>
</Toast>
