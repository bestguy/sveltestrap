<script>
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<h1>Custom Inputs</h1>
<a href="https://getbootstrap.com/docs/4.3/components/forms/#custom-forms" target="_blank">
  Bootstrap Custom Inputs
</a>

<Example source={sampleSource}>
  <Sample />
</Example>