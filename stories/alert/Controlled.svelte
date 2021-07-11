<script lang="ts">
  import { Alert, Button } from 'sveltestrap';

  let visible = true;
</script>

<Alert color="primary" isOpen={visible} toggle={() => (visible = false)}>
  I can be controlled via <code>isOpen</code> and <code>toggle</code>.
</Alert>

<Button on:click={() => (visible = !visible)}>You can toggle me here.</Button>
