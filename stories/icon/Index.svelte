<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<h1>Icons</h1>
<a href="https://icons.getbootstrap.com" target="_blank">
  Bootstrap Icons
</a>

<Example source={sampleSource}>
  <Sample />
</Example>
