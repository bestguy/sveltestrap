<script>
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Example from '../Example.svelte';
</script>

<h1>Carousel</h1>

<a href="https://getbootstrap.com/docs/4.3/components/carousel/" target="_blank">
  Bootstrap Carousel
</a>

<Example source={sampleSource}>
  <Sample />
</Example>