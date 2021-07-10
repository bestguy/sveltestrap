<script lang="ts">
  import { Button, Popover } from 'sveltestrap';

  let isOpen = false;
</script>

<div class="mt-3">
  <Button id="controlledBtn">You could click here</Button>
  <Popover
    bind:isOpen
    placement="right"
    target="controlledBtn"
    title="Controlled Popover"
  >
    This is a Popover controlled externally.
  </Popover>
  <hr />
  <label>
    <input type="checkbox" bind:checked={isOpen} />
    Or you can check this to control the Popover state.
  </label>
</div>
