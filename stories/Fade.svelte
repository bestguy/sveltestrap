<script>
  import Button from "../src/Button.svelte";
  import Card from "../src/Card.svelte";
  import CardBody from "../src/CardBody.svelte";
  import Fade from "../src/Fade.svelte";

  let open = false;
  const toggle = () => (open = !open);
</script>

<h1>Fade</h1>
<a href="https://getbootstrap.com/docs/4.3/components/fade/" target="_blank">
  Bootstrap Fade
</a>

<div>
  <Button color="primary" on:click={toggle}>Toggle</Button>
  <Fade isOpen={open}>
    <Card>
      <CardBody>
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
        labore wes anderson cred nesciunt sapiente ea proident.
      </CardBody>
    </Card>
  </Fade>
</div>
