<script lang="ts">
  import { Button, Offcanvas } from 'sveltestrap';
  let open = false;
  let endOpen = false;
  let bottomOpen = false;
  const toggle = () => (open = !open);
  const toggleEnd = () => (endOpen = !endOpen);
  const toggleBottom = () => (bottomOpen = !bottomOpen);
</script>

<div>
  <Button color="danger" on:click={toggle}>Open Start</Button>
  <Button color="warning" on:click={() => (endOpen = !endOpen)}>
    Open End
  </Button>
  <Button color="success" on:click={() => (bottomOpen = !bottomOpen)}>
    Open Bottom
  </Button>

  <Offcanvas isOpen={open} {toggle} header="Start" placement="start">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </Offcanvas>

  <Offcanvas isOpen={endOpen} toggle={toggleEnd} placement="end" header="Right">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </Offcanvas>

  <Offcanvas isOpen={bottomOpen} toggle={toggleBottom} placement="bottom" header="Bottom">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </Offcanvas>
</div>
