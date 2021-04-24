<script lang="ts">
  import { Collapse, Button, Card } from 'sveltestrap';
</script>

<Button color="primary" id="toggler" class="mb-3">Toggle</Button>
<Collapse toggler="#toggler">
  <Card body>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt magni,
    voluptas debitis similique porro a molestias consequuntur earum odio
    officiis natus, amet hic, iste sed dignissimos esse fuga! Minus, alias.
  </Card>
</Collapse>
