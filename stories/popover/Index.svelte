<script lang="ts">
  import Example from '../Example.svelte';
  import BasicSample from './BasicSample.svelte';
  import MoreSample from './MoreSample.svelte'
  import basicSampleSource from '!!raw-loader!./BasicSample.svelte';
  import moreSampleSource from '!!raw-loader!./MoreSample.svelte';
</script>

<h1>Popover</h1>

<Example title="Basic" source={basicSampleSource}>
  <BasicSample />
</Example>


<Example title="More" source={moreSampleSource}>
  <MoreSample />
</Example>
