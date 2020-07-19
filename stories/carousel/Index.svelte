<script lang="typescript">
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';

  import WithControls from './WithControls.svelte';
  import WithControlsSource from '!!raw-loader!./WithControls.svelte';

  import WithIndicators from './WithIndicators.svelte';
  import WithIndicatorsSource from '!!raw-loader!./WithIndicators.svelte';

  import WithCaptions from './WithCaptions.svelte';
  import WithCaptionsSource from '!!raw-loader!./WithCaptions.svelte';

  import Example from '../Example.svelte';
</script>

<h1>Carousel</h1>

<a
  href="https://getbootstrap.com/docs/4.3/components/carousel/"
  target="_blank">
  Bootstrap Carousel
</a>

<Example title="Slides only" source={sampleSource}>
  <Sample />
</Example>

<Example title="With Controls" source={WithControlsSource}>
  <WithControls />
</Example>

<Example title="With Indicators" source={WithIndicatorsSource}>
  <WithIndicators />
</Example>

<Example title="With Captions" source={WithCaptionsSource}>
  <WithCaptions />
</Example>
