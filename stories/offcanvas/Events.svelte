<script lang="ts">
  import { Button, Offcanvas } from 'sveltestrap';
  let open = false;
  let status = 'Closed';
  const toggle = () => (open = !open);
</script>

<div>
  <h5>Current state: {status}</h5>
  <Button color="danger" on:click={toggle}>Open</Button>

  <Offcanvas
    isOpen={open}
    {toggle}
    placement="end"
    on:opening={() => (status = 'Opening...')}
    on:open={() => (status = 'Opened')}
    on:closing={() => (status = 'Closing...')}
    on:close={() => (status = 'Closed')}
  >
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </Offcanvas>
</div>
