<script lang="ts">
  import { Button, Popover } from 'sveltestrap';
</script>

<div class="mt-3">
  <Button id="btn-trigger">Hover me</Button>
  <Popover
    trigger="hover"
    placement="right"
    target="btn-trigger"
    title="Popover with hover"
  >
    This is a Popover with hover as the trigger.
  </Popover>
</div>

<div class="mt-3">
  <Button id="btn-trigger2">Focus me</Button>
  <Popover
    trigger="focus"
    placement="right"
    target="btn-trigger2"
    title="Popover with focus"
  >
    This is a Popover with focus as the trigger.
  </Popover>
</div>
