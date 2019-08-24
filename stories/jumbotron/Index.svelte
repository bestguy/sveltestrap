<script>
  import Example from '../Example.svelte';
  import Fluid from './Fluid.svelte';
  import fluidSource from '!!raw-loader!./Fluid.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<h1>Jumbotrons</h1>
<a href="https://getbootstrap.com/docs/4.3/layout/jumbotron/" target="_blank">
  Bootstrap Jumbotron
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Fluid" source={fluidSource}>
  <Fluid />
</Example>