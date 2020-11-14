<script lang="ts">
  import Example from '../Example.svelte';
  import Binding from './Binding.svelte';
  import bindingSource from '!!raw-loader!./Binding.svelte';
  import On from './On.svelte';
  import onSource from '!!raw-loader!./On.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';

  const snippet = 'bind:value={yourValue}';
</script>

<h1>Inputs</h1>
<a
  href="https://v5.getbootstrap.com/docs/5.0/components/forms/#form-controls"
  target="_blank">
  Bootstrap Inputs
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Binding" source={bindingSource}>
  <p slot="info">
    The recommended way to bind values to Inputs is via
    <code>{snippet}</code>
  </p>
  <Binding />
</Example>

<Example title="Event Binding" source={onSource}>
  <p slot="info">
    You can also bind directly to these event handlers:
    <code>
      on:blur on:focus on:keydown on:keypress on:keyup on:change on:input
    </code>
    <br />
    but this is not recommended if you are just binding to a simple value -
    Svelte is not React. :-)
    <br />
    If you need more exotic events please follow issue
    <a href="https://github.com/bestguy/sveltestrap/issues/36" target="new">
      #36
    </a>
    .
  </p>
  <On />
</Example>
