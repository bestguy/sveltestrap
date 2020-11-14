<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./SimplifiedSample.svelte';
  import Container from './Container.svelte';
  import containerSource from '!!raw-loader!./Container.svelte';
</script>

<h1>Layout</h1>
<a href="https://v5.getbootstrap.com/docs/5.0/layout/grid/" target="_blank">
  Bootstrap Layout Grid
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Container" stacked source={containerSource}>
  <Container />
</Example>
