<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Fluid from './Fluid.svelte';
  import fluidSource from '!!raw-loader!./Fluid.svelte';
  import Thumbnail from './Thumbnail.svelte';
  import thumbnailSource from '!!raw-loader!./Thumbnail.svelte';
</script>

<h1>Card</h1>
<a href="https://getbootstrap.com/docs/5.0/content/images/" target="_blank">
  Bootstrap Image
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Fluid" source={fluidSource} stacked>
  <Fluid />
</Example>

<Example title="Thumbnail" source={thumbnailSource}>
  <Thumbnail />
</Example>
