<script lang="ts">
  import Popover from '../../src/Popover.svelte';
  import Button from '../../src/Button.svelte';
</script>


<Button id="btn">HELLO</Button>
<Popover placement="right" target="btn">
  <div slot="title">Hello</div>
  POPOVER
</Popover>
