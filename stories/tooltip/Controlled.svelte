<script lang="ts">
  import { Button, Tooltip } from 'sveltestrap';

  let isOpen = false;
</script>

<div class="mt-3">
  <Button id="controlledBtn">You could hover here</Button>
  <Tooltip bind:isOpen placement="right" target="controlledBtn">
    This is a Tooltip controlled externally.
  </Tooltip>
  <hr />
  <label>
    <input type="checkbox" bind:checked={isOpen} />
    Or you can check this to control the Tooltip state.
  </label>
</div>
