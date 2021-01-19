<script lang="ts">
  import Popover from '../../src/Popover.svelte';
  import Button from '../../src/Button.svelte';
</script>

<a class="btn btn-secondary" id="btnDismissable" tabindex="0">Click me</a>
<Popover placement="right" target="btnDismissable" dismissable>
  <div slot="title">
    <i>Hello</i> <b>World!</b>
  </div>
  This Popover dismisses when clicked outside.
</Popover>
