<script lang="ts">
  import Example from '../Example.svelte';
  import Bordered from './Bordered.svelte';
  import Borderless from './Borderless.svelte';
  import Dark from './Dark.svelte';
  import Hover from './Hover.svelte';
  import Responsive from './Responsive.svelte';
  import Sample from './Sample.svelte';
  // import Sizes from './Sizes.svelte';
  // import Striped from './Striped.svelte';
  import borderedSource from '!!raw-loader!./Bordered.svelte';
  import borderlessSource from '!!raw-loader!./Borderless.svelte';
  import darkSource from '!!raw-loader!./Dark.svelte';
  import hoverSource from '!!raw-loader!./Hover.svelte';
  import responsiveSource from '!!raw-loader!./Responsive.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  // import sizesSource from '!!raw-loader!./Sizes.svelte';
  // import stripedSource from '!!raw-loader!./Striped.svelte';
</script>

<h1>Table</h1>
<a href="https://v5.getbootstrap.com/docs/5.0/content/tables/" target="_blank">
  Bootstrap Table
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Bordered" source={borderedSource}>
  <Bordered />
</Example>

<Example title="Borderless" source={borderlessSource}>
  <Borderless />
</Example>

<Example title="Dark" source={darkSource}>
  <Dark />
</Example>

<Example title="Hover" source={hoverSource}>
  <Hover />
</Example>

<Example title="Responsive" source={responsiveSource}>
  <Responsive />
</Example>
