<script>
  import Button from "../src/Button.svelte";
  import Card from "../src/Card.svelte";
  import CardBody from "../src/CardBody.svelte";
  import Collapse from "../src/Collapse.svelte";

  let open = false;
  const toggle = () => (open = !open);
</script>

<h1>Collapse</h1>
<a href="https://getbootstrap.com/docs/4.3/components/collapse/" target="_blank">
  Bootstrap Collapse
</a>

<div>
  <Button color="primary" on:click={toggle}>Toggle</Button>
  <Collapse isOpen={open}>
    <Card>
      <CardBody>
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
        labore wes anderson cred nesciunt sapiente ea proident.
      </CardBody>
    </Card>
  </Collapse>
</div>
