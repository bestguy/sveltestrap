<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import source from '!!raw-loader!./Sample.svelte';
  import Flush from './Flush.svelte';
  import flushSource from '!!raw-loader!./Flush.svelte';
  import Events from './Events.svelte';
  import eventsSource from '!!raw-loader!./Events.svelte';
  import Slots from './Slots.svelte';
  import slotsSource from '!!raw-loader!./Slots.svelte';
  import StayOpen from './StayOpen.svelte';
  import stayOpenSource from '!!raw-loader!./StayOpen.svelte';
</script>

<h1>Accordion</h1>
<a
  href="https://getbootstrap.com/docs/5.0/components/accordion/"
  target="_blank"
>
  Bootstrap Accordion
</a>

<Example {source}>
  <Sample />
</Example>

<Example title="Flush" source={flushSource}>
  <Flush />
</Example>

<Example title="Stay Open" source={stayOpenSource}>
  <p slot="info">
    Add the <code>stayOpen</code> prop to make accordion items stay open when another
    item is opened.
  </p>
  <StayOpen />
</Example>

<Example title="Slots" source={slotsSource}>
  <Slots />
</Example>

<Example title="Events" source={eventsSource}>
  <Events />
</Example>
