<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Sizes from './Sizes.svelte';
  import sizesSource from '!!raw-loader!./Sizes.svelte';
</script>

<h1>Modals</h1>
<a href="https://getbootstrap.com/docs/4.3/components/modal/" target="_blank">
  Bootstrap Modals
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Sizes" source={sizesSource}>
  <Sizes />
</Example>
