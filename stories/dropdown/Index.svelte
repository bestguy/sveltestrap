<script lang="ts">
  import Example from '../Example.svelte';
  import Alignment from './Alignment.svelte';
  import alignmentSource from '!!raw-loader!./Alignment.svelte';
  import AutoClose from './AutoClose.svelte';
  import autoCloseSource from '!!raw-loader!./AutoClose.svelte';
  import Direction from './Direction.svelte';
  import directionSource from '!!raw-loader!./Direction.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Sizes from './Sizes.svelte';
  import sizesSource from '!!raw-loader!./Sizes.svelte';
  import Controlled from './Controlled.svelte';
  import controlledSource from '!!raw-loader!./Controlled.svelte';
  import SetActiveFromChild from './SetActiveFromChild.svelte';
  import setActiveFromChildSource from '!!raw-loader!./SetActiveFromChild.svelte';
</script>

<h1>Dropdowns</h1>
<a
  href="https://getbootstrap.com/docs/5.3/components/dropdowns/"
  target="_blank"
>
  Bootstrap Dropdowns
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Alignment" source={alignmentSource}>
  <Alignment />
</Example>

<Example title="Direction" source={directionSource}>
  <Direction />
</Example>

<Example title="Sizes" source={sizesSource}>
  <Sizes />
</Example>

<Example title="Container" source={controlledSource}>
  <Controlled />
</Example>

<Example title="SetActiveFromChild" source={setActiveFromChildSource}>
  <SetActiveFromChild />
</Example>

<Example title="AutoClose" source={autoCloseSource}>
  <AutoClose />
</Example>
