<script lang="ts">
  import { Fade, Button, Card } from 'sveltestrap';

  let isOpen = false;
  let status = 'Closed';
</script>

<Button color="primary" on:click={() => (isOpen = !isOpen)} class="mb-3">
  Toggle
</Button>

<h5>Current state: {status}</h5>
<Fade
  {isOpen}
  on:opening={() => (status = 'Opening...')}
  on:open={() => (status = 'Opened')}
  on:closing={() => (status = 'Closing...')}
  on:close={() => (status = 'Closed')}
>
  <Card body>
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
    richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes
    anderson cred nesciunt sapiente ea proident.
  </Card>
</Fade>
