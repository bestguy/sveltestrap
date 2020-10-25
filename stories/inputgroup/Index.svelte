<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<h1>Navbar</h1>
<a href="https://getbootstrap.com/docs/4.5/components/input-group/" target="_blank">
  Bootstrap Input Group
</a>

<Example source={sampleSource}>
  <Sample />
</Example>