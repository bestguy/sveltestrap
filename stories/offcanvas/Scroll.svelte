<script lang="ts">
  import { Button, Offcanvas } from 'sveltestrap';
  let open = false;
  const toggle = () => (open = !open);
</script>

<div>
  <Button color="danger" on:click={toggle}>Open Offcanvas</Button>

  <Offcanvas
    header="You can scroll body"
    scroll
    isOpen={open}
    {toggle}
    backdrop={false}
  >
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </Offcanvas>
</div>
