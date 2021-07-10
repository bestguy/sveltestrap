<script lang="ts">
  import Example from '../Example.svelte';
  import Events from './Events.svelte';
  import eventsSource from '!!raw-loader!./Events.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Backdrop from './Backdrop.svelte';
  import backdropSource from '!!raw-loader!./Backdrop.svelte';
  import Manual from './Manual.svelte';
  import manualSource from '!!raw-loader!./Manual.svelte';
  import Scroll from './Scroll.svelte';
  import scrollSource from '!!raw-loader!./Scroll.svelte';
  import Slots from './Slots.svelte';
  import slotsSource from '!!raw-loader!./Slots.svelte';
</script>

<h1>Offcanvas</h1>
<a
  href="https://getbootstrap.com/docs/5.0/components/offcanvas/"
  target="_blank"
>
  Bootstrap Offcanvas
</a>

<Example title="Placement" source={sampleSource}>
  <Sample />
</Example>

<Example source={backdropSource} title="No Backdrop">
  <Backdrop />
</Example>

<Example source={scrollSource} title="Scrollable">
  <Scroll />
</Example>

<Example source={slotsSource} title="Slots">
  <Slots />
</Example>

<Example source={manualSource} title="Manual toggling">
  <Manual />
</Example>

<Example source={eventsSource} title="Events">
  <Events />
</Example>
