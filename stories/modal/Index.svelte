<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Fullscreen from './Fullscreen.svelte';
  import fullscreenSource from '!!raw-loader!./Fullscreen.svelte';
  import Sizes from './Sizes.svelte';
  import sizesSource from '!!raw-loader!./Sizes.svelte';
</script>

<h1>Modals</h1>
<a href="https://v5.getbootstrap.com/docs/5.0/components/modal/" target="_blank">
  Bootstrap Modals
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Sizes" source={sizesSource}>
  <Sizes />
</Example>

<Example title="Fullscreen" source={fullscreenSource}>
  <Fullscreen />
</Example>
