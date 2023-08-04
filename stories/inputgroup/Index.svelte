<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<h1>InputGroup</h1>
<a href="https://getbootstrap.com/docs/5.3/forms/input-group//" target="_blank">
  Bootstrap Input Group
</a>

<Example source={sampleSource}>
  <Sample />
</Example>
