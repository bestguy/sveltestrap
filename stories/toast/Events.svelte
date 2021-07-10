<script lang="ts">
  import { Button, Toast } from 'sveltestrap';
  let isOpen = false;
  let status = 'Closed';
  const toggle = () => (isOpen = !isOpen);
</script>

<div>
  <h5>Current state: {status}</h5>
  <Button color="danger" on:click={toggle}>Open Toast</Button>
  <Toast
    body
    header="It's Toasterific"
    {isOpen}
    on:open={() => (status = 'Opened')}
    on:opening={() => (status = 'Opening...')}
    on:closing={() => (status = 'Closing...')}
    on:close={() => (status = 'Closed')}
  >
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
  </Toast>
</div>
