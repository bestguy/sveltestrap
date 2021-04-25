<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Split from './Split.svelte';
  import splitSource from '!!raw-loader!./Split.svelte';
  import Controlled from './Controlled.svelte';
  import controlledSource from '!!raw-loader!./Controlled.svelte';
</script>

<h1>ButtonDropdown</h1>
<a
  href="https://getbootstrap.com/docs/4.5/components/dropdowns/#single-button"
  target="_blank">
  Bootstrap Button Dropdowns
</a>

<Example title="Single Button Dropdowns" source={sampleSource}>
  <Sample />
</Example>

<Example title="Split Button Dropdowns" source={splitSource}>
  <Split />
</Example>

<Example title="Controlled" source={controlledSource}>
  <Controlled />
</Example>
