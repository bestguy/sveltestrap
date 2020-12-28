<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import source from '!!raw-loader!./Sample.svelte';
  import Events from './Events.svelte';
  import eventsSource from '!!raw-loader!./Events.svelte';
  import Slots from './Slots.svelte';
  import slotsSource from '!!raw-loader!./Slots.svelte';
</script>

<h1>Accordion</h1>
<a
  href="https://getbootstrap.com/docs/5.0/components/accordion/"
  target="_blank">
  Bootstrap Accordion
</a>

<Example {source}>
  <Sample />
</Example>

<Example title="Slots" source={slotsSource}>
  <Slots />
</Example>

<Example title="Events" source={eventsSource}>
  <Events />
</Example>
