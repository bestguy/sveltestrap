<script lang="ts">
  import Example from '../Example.svelte';
  import Events from './Events.svelte';
  import eventsSource from '!!raw-loader!./Events.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Uncontrolled from './Uncontrolled.svelte';
  import uncontrolledSource from '!!raw-loader!./Uncontrolled.svelte';
</script>

<h1>Fade</h1>
Bootstrap does not have a fade component, but utility CSS and JS is used in Carousels,
ListGroups, Modals, and Navs.
<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Events" source={eventsSource}>
  <p slot="info">
    Use the on:opening, on:open, on:closing and on:close props for callbacks
    when the Fade has finished opening (entering) or closing (exiting).
  </p>
  <Events />
</Example>

<Example title="Uncontrolled" source={uncontrolledSource}>
  <p slot="info">
    For the most basic use-case, an uncontrolled component can provide the
    functionality wanted without the need to manage/control the state of the
    component. Fade does not require an isOpen prop. Instead pass a toggler
    prop. The toggler prop is a string which will run querySelectorAll to find
    dom elements which will trigger toggle.
  </p>
  <Uncontrolled />
</Example>
