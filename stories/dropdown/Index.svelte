<script lang="ts">
  import Example from '../Example.svelte';
  import Alignment from './Alignment.svelte';
  import alignmentSource from '!!raw-loader!./Alignment.svelte';
  import Direction from './Direction.svelte';
  import directionSource from '!!raw-loader!./Direction.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Sizes from './Sizes.svelte';
  import sizesSource from '!!raw-loader!./Sizes.svelte';
  import Uncontrolled from './Uncontrolled.svelte';
  import uncontrolledSource from '!!raw-loader!./Uncontrolled.svelte';
  import SetActiveFromChild from './SetActiveFromChild.svelte';
  import setActiveFromChildSource from '!!raw-loader!./SetActiveFromChild.svelte';
</script>

<h1>Dropdowns</h1>
<a
  href="https://getbootstrap.com/docs/4.3/components/dropdowns/"
  target="_blank">
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

<Example title="Uncontrolled" source={uncontrolledSource}>
  <Uncontrolled />
</Example>

<Example title="SetActiveFromChild" source={setActiveFromChildSource}>
  <SetActiveFromChild />
</Example>
