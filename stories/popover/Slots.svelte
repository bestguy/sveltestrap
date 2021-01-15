<script lang="ts">
  import Popover from '../../src/Popover.svelte';
  import Button from '../../src/Button.svelte';
</script>

<Button id="btn">Click me</Button>
<Popover placement="right" target="btn">
  <div slot="title">
    <i>Hello</i> <b>World!</b>
  </div>
  This Popover has HTML in the title passed as a slot.
</Popover>
