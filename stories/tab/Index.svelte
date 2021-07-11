<script lang="ts">
  import Example from '../Example.svelte';
  import Events from './Events.svelte';
  import eventsSource from '!!raw-loader!./Events.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Slots from './Slots.svelte';
  import slotsSource from '!!raw-loader!./Slots.svelte';
  import Pills from './Pills.svelte';
  import pillsSource from '!!raw-loader!./Pills.svelte';
  import Vertical from './Vertical.svelte';
  import verticalSource from '!!raw-loader!./Vertical.svelte';
</script>

<h1>TabContent and TabPane</h1>
<a
  href="https://getbootstrap.com/docs/5.0/components/navs-tabs/#javascript-behavior"
  target="_blank"
>
  Bootstrap Tabs
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Pills" source={pillsSource}>
  <Pills />
</Example>

<Example title="Slots" source={slotsSource}>
  <Slots />
</Example>

<Example title="Vertical" source={verticalSource}>
  <Vertical />
</Example>

<Example title="Events" source={eventsSource}>
  <Events />
</Example>
