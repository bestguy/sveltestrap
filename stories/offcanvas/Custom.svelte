<script>
  import { Button, Offcanvas } from 'sveltestrap';
  let open = false;
</script>

<div>
  <Button color="danger" on:click={() => (open = true)}>Open Offcanvas</Button>

  <Offcanvas isOpen={open} body={false} style="width: 150px" class="bg-danger">
    <img
      alt="Meaningless content"
      role="button"
      src="https://picsum.photos/150/1200"
      on:click={() => (open = false)}
    />
  </Offcanvas>
</div>
