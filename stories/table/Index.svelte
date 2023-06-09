<script lang="ts">
  import Example from '../Example.svelte';
  import Bordered from './Bordered.svelte';
  import Borderless from './Borderless.svelte';
  import Column from './Column.svelte';
  import Hover from './Hover.svelte';
  import Responsive from './Responsive.svelte';
  import Sample from './Sample.svelte';
  import Sizes from './Sizes.svelte';
  import Striped from './Striped.svelte';
  import stripedSource from '!!raw-loader!./Striped.svelte';
  import borderedSource from '!!raw-loader!./Bordered.svelte';
  import borderlessSource from '!!raw-loader!./Borderless.svelte';
  import columnSource from '!!raw-loader!./Column.svelte';
  import hoverSource from '!!raw-loader!./Hover.svelte';
  import responsiveSource from '!!raw-loader!./Responsive.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import sizesSource from '!!raw-loader!./Sizes.svelte';
</script>

<h1>Table</h1>
<a href="https://getbootstrap.com/docs/5.0/content/tables/" target="_blank">
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

<Example title="Hover" source={hoverSource}>
  <Hover />
</Example>

<Example title="Striped" source={stripedSource}>
  <Striped />
</Example>

<Example title="Sizes" source={sizesSource}>
  <Sizes />
</Example>

<Example title="Responsive" source={responsiveSource}>
  <Responsive />
</Example>

<Example title="Columns" source={columnSource}>
  <Column />
</Example>
