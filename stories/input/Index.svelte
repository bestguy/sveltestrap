<script lang="ts">
  import Example from '../Example.svelte';
  import Binding from './Binding.svelte';
  import bindingSource from '!!raw-loader!./Binding.svelte';
  import On from './On.svelte';
  import onSource from '!!raw-loader!./On.svelte';
  import Feedback from './Feedback.svelte';
  import feedbackSource from '!!raw-loader!./Feedback.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';

  const snippet = 'bind:value={yourValue}';
</script>

<h1>Inputs</h1>
<a href="https://getbootstrap.com/docs/5.0/forms/form-control/" target="_blank">
  Bootstrap Inputs
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Validation Feedback" source={feedbackSource}>
  <Feedback />
</Example>

<Example title="Binding" source={bindingSource}>
  <p slot="info">
    The recommended way to bind values to Inputs is via
    <code>{snippet}</code>
    <br />
    The Input component also exposes its inner HTMLElement with
    <code>bind:inner</code>
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
    but this is not recommended if you are just binding to a simple value - Svelte
    is not React. :-)
    <br />
    If you need more exotic events please follow issue
    <a href="https://github.com/bestguy/sveltestrap/issues/36" target="new">
      #36
    </a>
    .
  </p>
  <On />
</Example>
