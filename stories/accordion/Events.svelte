<script lang="ts">
  import { Accordion, AccordionItem } from 'sveltestrap';

  let id = 1;
  let open = true;
</script>

<Accordion on:toggle={console.log}>
  <AccordionItem active header="Home" on:toggle={e => {
    id = 1;
    open = e.detail;
  }}>
    Fallbrook
  </AccordionItem>
  <AccordionItem header="School" on:toggle={e => {
    id = 2;
    open = e.detail;
  }}>
    <a href="#home">Buena Vista Elementary</a>
  </AccordionItem>
  <AccordionItem header="Library" on:toggle={e => {
    id = 3;
    open = e.detail;
  }}>
    UCSB Library
  </AccordionItem>
</Accordion>
<hr />
Item #{id} is {open ? 'open' : 'closed'}
