<script lang="typescript">
  import { Collapse, Button, CardBody, Card } from 'sveltestrap';

  let isOpen = false;
  let status = 'Closed';

  const onEntering = () => (status = 'Opening...');
  const onEntered = () => (status = 'Opened');
  const onExiting = () => (status = 'Closing...');
  const onExited = () => (status = 'Closed');
</script>

<Button color="primary" on:click={() => (isOpen = !isOpen)} class="mb-3">
  Toggle
</Button>
<h5>Current state: {status}</h5>
<Collapse {isOpen} {onEntering} {onEntered} {onExiting} {onExited}>
  <Card body>
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
    richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes
    anderson cred nesciunt sapiente ea proident.
  </Card>
</Collapse>
