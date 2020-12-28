<script lang="ts">
  import Example from '../Example.svelte';
  import BasicSample from './BasicSample.svelte';
  import HtmlSample from './HtmlSample.svelte';
  import basicSampleSource from '!!raw-loader!./BasicSample.svelte';
  import htmlSampleSource from '!!raw-loader!./HtmlSample.svelte';
</script>

<h1>Tooltip</h1>

<Example title="Basic" source={basicSampleSource}>
  <BasicSample />
</Example>

<Example title="Html tag" source={htmlSampleSource}>
  <HtmlSample />
</Example>
