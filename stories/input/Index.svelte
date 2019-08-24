<script>
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<h1>Inputs</h1>
<a href="https://getbootstrap.com/docs/4.3/components/forms/#form-controls" target="_blank">
  Bootstrap Inputs
</a>

<Example source={sampleSource}>
  <Sample />
</Example>