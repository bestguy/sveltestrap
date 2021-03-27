<script lang="ts">
  import { Button, Offcanvas } from 'sveltestrap';
  let open = false;
  const toggle = () => (open = !open);
</script>

<div>
  <Button color="danger" on:click={toggle}>Open Offcanvas</Button>

  <Offcanvas header="No Backdrop" backdrop={false} isOpen={open} {toggle}>
    Look ma, no backdrop.
  </Offcanvas>
</div>
