<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./SimplifiedSample.svelte';
</script>

<h1>Layout</h1>
<a href="https://getbootstrap.com/docs/5.3/layout/grid/" target="_blank">
  Bootstrap Layout Grid
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

