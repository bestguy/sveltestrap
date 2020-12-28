<script lang="ts">
  import Example from '../Example.svelte';
  import BasicSample from './BasicSample.svelte';
  import HtmlSample from './HtmlSample.svelte';
  import basicSampleSource from '!!raw-loader!./BasicSample.svelte';
  import htmlSampleSource from '!!raw-loader!./HtmlSample.svelte';
</script>

<h1>Tooltip</h1>
<a href="https://getbootstrap.com/docs/5.0/components/tooltips/" target="_blank">
  Bootstrap Tooltip
</a>

<Example title="Basic" source={basicSampleSource}>
  <BasicSample />
</Example>

<Example title="HTML Content" source={htmlSampleSource}>
  <HtmlSample />
</Example>
