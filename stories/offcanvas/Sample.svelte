<script lang="ts">
  import { Button, Offcanvas } from 'sveltestrap';
  let open = false;
  let endOpen = false;
  let bottomOpen = false;
  let topOpen = false;
  const toggle = () => (open = !open);
  const toggleEnd = () => (endOpen = !endOpen);
  const toggleBottom = () => (bottomOpen = !bottomOpen);
  const toggleTop = () => (topOpen = !topOpen);
</script>

<div>
  <Button color="danger" on:click={toggle}>Start</Button>
  <Button color="warning" on:click={() => (endOpen = !endOpen)}>End</Button>
  <Button color="success" on:click={() => (topOpen = !topOpen)}>Top</Button>
  <Button color="info" on:click={() => (bottomOpen = !bottomOpen)}>
    Bottom
  </Button>

  <Offcanvas isOpen={open} {toggle} header="Start" placement="start">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </Offcanvas>

  <Offcanvas isOpen={endOpen} toggle={toggleEnd} placement="end" header="Right">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </Offcanvas>

  <Offcanvas isOpen={topOpen} toggle={toggleTop} placement="top" header="Top">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </Offcanvas>

  <Offcanvas
    isOpen={bottomOpen}
    toggle={toggleBottom}
    placement="bottom"
    header="Bottom"
  >
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </Offcanvas>
</div>
