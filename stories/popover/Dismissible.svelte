<script lang="ts">
  import Popover from '../../src/Popover.svelte';
</script>

<a class="btn btn-secondary" id="btnDismissible" tabindex="0">Click me</a>
<Popover placement="right" target="btnDismissible" dismissible>
  <div slot="title">
    <i>Hello</i> <b>World!</b>
  </div>
  This Popover dismisses when clicked outside.
</Popover>
