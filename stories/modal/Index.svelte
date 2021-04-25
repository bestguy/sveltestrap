<script lang="ts">
  import Example from '../Example.svelte';
  import Backdrop from './Backdrop.svelte';
  import backdropSource from '!!raw-loader!./Backdrop.svelte';
  import External from './External.svelte';
  import externalSource from '!!raw-loader!./External.svelte';
  import Fade from './Fade.svelte';
  import fadeSource from '!!raw-loader!./Fade.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Sizes from './Sizes.svelte';
  import sizesSource from '!!raw-loader!./Sizes.svelte';
  import Static from './Static.svelte';
  import staticSource from '!!raw-loader!./Static.svelte';
</script>

<h1>Modals</h1>
<a href="https://getbootstrap.com/docs/4.5/components/modal/" target="_blank">
  Bootstrap Modals
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Sizes" source={sizesSource}>
  <Sizes />
</Example>

<Example title="Backdrop" source={backdropSource}>
  <Backdrop />
</Example>

<Example title="Fade" source={fadeSource}>
  <Fade />
</Example>

<Example title="Static" source={staticSource}>
  <Static />
</Example>


<Example title="External Content" source={externalSource}>
  <External />
</Example>
