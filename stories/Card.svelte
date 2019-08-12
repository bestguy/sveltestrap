<script>
  import Button from "../src/Button.svelte";
  import Card from '../src/Card';
  import CardBody from '../src/CardBody';
  import CardFooter from '../src/CardFooter';
  import CardHeader from '../src/CardHeader';
  import CardImg from '../src/CardImg';
  import CardSubtitle from '../src/CardSubtitle';
  import CardText from '../src/CardText';
  import CardTitle from '../src/CardTitle';
  import ButtonGroup from "../src/ButtonGroup.svelte";
</script>

<Card class="mb-3">
  <CardBody>
    Hello World
  </CardBody>
</Card>

<h3>Card with Header and Footer</h3>
<Card class="mb-3">
  <CardHeader>
    <CardTitle>Card title</CardTitle>
  </CardHeader>
  <CardBody>
    <CardSubtitle>Card subtitle</CardSubtitle>
    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
    <Button>Button</Button>
  </CardBody>
  <CardFooter>
    Footer
  </CardFooter>
</Card>