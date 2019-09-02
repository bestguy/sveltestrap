<script>
  import { ListGroup, ListGroupItem } from "sveltestrap";
</script>

<h4>Anchors</h4>
<ListGroup>
  <ListGroupItem active tag="a" href="https://svelte.dev" action>
    Active
  </ListGroupItem>
  <ListGroupItem tag="a" href="https://svelte.dev" action>
    Bravo
  </ListGroupItem>
  <ListGroupItem tag="a" href="https://svelte.dev" action>
    Charlie
  </ListGroupItem>
  <ListGroupItem tag="a" href="https://svelte.dev" action>
    Delta
  </ListGroupItem>
  <ListGroupItem disabled tag="a" href="https://svelte.dev" action>
    Disabled
  </ListGroupItem>
</ListGroup>

<h4 class="mt-3">Buttons</h4>
<ListGroup>
  <ListGroupItem active tag="button" action>Active</ListGroupItem>
  <ListGroupItem tag="button" action>Bravo</ListGroupItem>
  <ListGroupItem tag="button" action>Charlie</ListGroupItem>
  <ListGroupItem tag="button" action>Delta</ListGroupItem>
  <ListGroupItem disabled tag="button" action>Disabled</ListGroupItem>
</ListGroup>
