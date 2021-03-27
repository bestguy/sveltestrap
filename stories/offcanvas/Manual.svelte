<script lang="ts">
  import { Button, Offcanvas } from 'sveltestrap';
  let open = false;
</script>

<div>
  <Button color="danger" on:click={() => open = true}>Open Offcanvas</Button>

  <Offcanvas header="No toggle or esc" scroll isOpen={open}>
    <Button color="danger" on:click={() => open = false}>Close Me Offcanvas</Button>
  </Offcanvas>
</div>
