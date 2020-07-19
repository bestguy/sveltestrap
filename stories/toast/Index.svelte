<script lang="typescript">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Dismissing from './Dismissing.svelte';
  import dismissingSource from '!!raw-loader!./Dismissing.svelte';
  import Icons from './Icons.svelte';
  import iconsSource from '!!raw-loader!./Icons.svelte';
</script>

<h1>Toast</h1>
<a href="https://getbootstrap.com/docs/4.3/components/toasts/" target="_blank">
  Bootstrap Toasts
</a>

<Example title="Colors" source={sampleSource}>
  <Sample />
</Example>

<Example title="Icons" source={iconsSource}>
  <Icons />
</Example>

<Example title="Dismissable" source={dismissingSource}>
  <Dismissing />
</Example>
