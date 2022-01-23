<script lang="ts">
  import Example from '../Example.svelte';
  import FloatingLabels from './FloatingLabels.svelte';
  import floatingLabelsSource from '!!raw-loader!./FloatingLabels.svelte';
</script>

<h1>FormGroup</h1>
<a
  href="https://getbootstrap.com/docs/5.1/forms/floating-labels/"
  target="_blank"
>
  Bootstrap Floating Labels
</a>

<Example title="Floating Labels" source={floatingLabelsSource}>
  <FloatingLabels />
</Example>
