<script lang="ts">
  import { Accordion, AccordionItem } from 'sveltestrap';
</script>

<Accordion>
  <AccordionItem active>
    <h4 class="m-0" slot="header">Home</h4>
    Fallbrook
  </AccordionItem>
  <AccordionItem>
    <h4 class="m-0" slot="header">School</h4>
    <a href="#home">Buena Vista Elementary</a>
  </AccordionItem>
  <AccordionItem>
    <h4 class="m-0" slot="header">Library</h4>
    UCSB Library
  </AccordionItem>
</Accordion>
