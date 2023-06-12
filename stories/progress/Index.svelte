<script lang="ts">
  import Example from '../Example.svelte';

  import Animated from './Animated.svelte';
  import Colors from './Colors.svelte';
  import Labels from './Labels.svelte';
  import Max from './Max.svelte';
  import Multi from './Multi.svelte';
  import Sample from './Sample.svelte';
  import Striped from './Striped.svelte';

  import animatedSource from '!!raw-loader!./Animated.svelte';
  import colorsSource from '!!raw-loader!./Colors.svelte';
  import labelsSource from '!!raw-loader!./Labels.svelte';
  import maxSource from '!!raw-loader!./Max.svelte';
  import multiSource from '!!raw-loader!./Multi.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import stripedSource from '!!raw-loader!./Striped.svelte';
</script>

<h1>Progress</h1>
<a
  href="https://getbootstrap.com/docs/5.3/components/progress/"
  target="_blank"
>
  Bootstrap Progress
</a>

<Example title="Sample" source={sampleSource}>
  <Sample />
</Example>

<Example title="Colors" source={colorsSource}>
  <Colors />
</Example>

<Example title="Labels" source={labelsSource}>
  <Labels />
</Example>

<Example title="Striped" source={stripedSource}>
  <Striped />
</Example>

<Example title="Animated" source={animatedSource}>
  <Animated />
</Example>

<Example title="Multi" source={multiSource}>
  <Multi />
</Example>

<Example title="Max" source={maxSource}>
  <Max />
</Example>
