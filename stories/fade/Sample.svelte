<script lang="ts">
  import { Fade, Button, CardBody, Card } from 'sveltestrap';
  let isOpen = false;
</script>

<Button color="primary" on:click={() => (isOpen = !isOpen)} class="mb-3">
  Toggle
</Button>
<Fade {isOpen}>
  <Card body>
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
    richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes
    anderson cred nesciunt sapiente ea proident.
  </Card>
</Fade>
