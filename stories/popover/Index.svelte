<script lang="ts">
  import Popover from '../../src/Popover.svelte';
  import Button from '../../src/Button.svelte';
</script>

<h1>Popover</h1>

<Button id="btn">HELLO</Button>
<Popover target="btn" placement="right">Hi</Popover>
