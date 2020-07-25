<script lang="ts">
  import Example from '../Example.svelte';
  import Binding from './Binding.svelte';
  import bindingSource from '!!raw-loader!./Binding.svelte';
  import On from './On.svelte';
  import onSource from '!!raw-loader!./On.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<h1>Custom Inputs</h1>
<a
  href="https://getbootstrap.com/docs/4.3/components/forms/#custom-forms"
  target="_blank">
  Bootstrap Custom Inputs
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Binding" source={bindingSource}>
  <Binding />
</Example>

<Example title="Event Binding" source={onSource}>
  <On />
</Example>
