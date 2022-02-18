<script lang="ts">
  import Example from '../Example.svelte';
  import Events from './Events.svelte';
  import eventsSource from '!!raw-loader!./Events.svelte';
  import Horizontal from './Horizontal.svelte';
  import horizontalSource from '!!raw-loader!./Horizontal.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Uncontrolled from './Uncontrolled.svelte';
  import uncontrolledSource from '!!raw-loader!./Uncontrolled.svelte';
</script>

<h1>Collapse</h1>
<a
  href="https://getbootstrap.com/docs/5.0/components/collapse/"
  target="_blank"
>
  Bootstrap Collapse
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Horizontal" source={horizontalSource}>
  <Horizontal />
</Example>

<Example title="Events" source={eventsSource}>
  <p slot="info">
    Use the on:opening, on:open, on:closing and on:close props for callbacks
    when the Collapse has finished opening (entering) or closing (exiting).
  </p>
  <Events />
</Example>

<Example title="Uncontrolled Collapse" source={uncontrolledSource}>
  <p slot="info">
    For the most basic use-case, an uncontrolled component can provide the
    functionality wanted without the need to manage/control the state of the
    component. Collapse does not require an isOpen prop. Instead pass a toggler
    prop. The toggler prop is a string which will run querySelectorAll to find
    dom elements which will trigger toggle.
  </p>
  <Uncontrolled />
</Example>
