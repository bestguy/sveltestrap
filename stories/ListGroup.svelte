<script>
  import ListGroup from "../src/ListGroup.svelte";
  import ListGroupItem from "../src/ListGroupItem.svelte";
  import ListGroupItemHeading from "../src/ListGroupItemHeading.svelte";
  import ListGroupItemText from "../src/ListGroupItemText.svelte";
  import { colors } from './colors';
</script>

<div class="mb-3">
  <ListGroup>
    <ListGroupItem active>Active</ListGroupItem>
    <ListGroupItem>Bravo</ListGroupItem>
    <ListGroupItem>Charlie</ListGroupItem>
    <ListGroupItem disabled>Disabled</ListGroupItem>
  </ListGroup>
</div>

<div class="mb-3">
  <h3>Flush</h3>
  <ListGroup flush>
    <ListGroupItem active>Active</ListGroupItem>
    <ListGroupItem>Bravo</ListGroupItem>
    <ListGroupItem>Charlie</ListGroupItem>
  </ListGroup>
</div>

<div class="mb-3">
  <h3>ListGroupItemHeading, ListGroupItemText</h3>
  <ListGroup>
    <ListGroupItem active>
      <ListGroupItemHeading>Active</ListGroupItemHeading>
      <ListGroupItemText>Lorem ipsem dolor</ListGroupItemText>
    </ListGroupItem>
    <ListGroupItem>
      <ListGroupItemHeading>Bravo</ListGroupItemHeading>
      <ListGroupItemText>Lorem ipsem dolor</ListGroupItemText>
    </ListGroupItem>
    <ListGroupItem>
      <ListGroupItemHeading>Charlie</ListGroupItemHeading>
      <ListGroupItemText>Lorem ipsem dolor</ListGroupItemText>
    </ListGroupItem>
    <ListGroupItem disabled>
      <ListGroupItemHeading>Disabled</ListGroupItemHeading>
      <ListGroupItemText>Lorem ipsem dolor</ListGroupItemText>
    </ListGroupItem>
  </ListGroup>
</div>

<div class="mb-3">
  <h3>Actions, href, tag</h3>
  <ListGroup>
    <ListGroupItem active tag="a" href="#" action>Active link action</ListGroupItem>
    <ListGroupItem tag="a" href="#" action>Link action</ListGroupItem>
    <ListGroupItem tag="button" action>Button action</ListGroupItem>
    <ListGroupItem disabled tag="a" href="#" action>Disabled action</ListGroupItem>
  </ListGroup>
</div>

<div class="mb-3">
  <h3>ListGroupItem Colors</h3>
  <ListGroup>
    {#each colors as color}
    <ListGroupItem {color}>{color}</ListGroupItem>
    {/each}
  </ListGroup>
</div>

 