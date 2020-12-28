<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<h1>InputGroup</h1>
<a href="https://v5.getbootstrap.com/docs/5.0/components/input-group/" target="_blank">
  Bootstrap Input Group
</a>

<Example source={sampleSource}>
  <Sample />
</Example>