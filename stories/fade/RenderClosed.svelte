<script lang="ts">
  import { Fade, Button, Card } from 'sveltestrap';
  let isOpen = false;
</script>

<Button color="primary" on:click={() => (isOpen = !isOpen)} class="mb-3">
  Toggle
</Button>
<Fade {isOpen} renderWhenClosed>
  <Card body>
    I've been here the whole time.
  </Card>
</Fade>
