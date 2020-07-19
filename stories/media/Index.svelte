<script>
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<h1>Media Object</h1>
<a
  href="https://getbootstrap.com/docs/4.3/components/media-object//"
  target="_blank">
  Bootstrap Media Object
</a>

<Example source={sampleSource}>
  <Sample />
</Example>
