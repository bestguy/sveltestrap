<script lang="ts">
  import Example from '../Example.svelte';
  import Autohide from './Autohide.svelte';
  import autohideSource from '!!raw-loader!./Autohide.svelte';
  import Events from './Events.svelte';
  import eventsSource from '!!raw-loader!./Events.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Dismissing from './Dismissing.svelte';
  import dismissingSource from '!!raw-loader!./Dismissing.svelte';
  import Icons from './Icons.svelte';
  import iconsSource from '!!raw-loader!./Icons.svelte';
</script>

<h1>Toast</h1>
<a href="https://getbootstrap.com/docs/5.3/components/toasts/" target="_blank">
  Bootstrap Toasts
</a>

<Example title="Colors" source={sampleSource}>
  <Sample />
</Example>

<Example title="Icons" source={iconsSource}>
  <Icons />
</Example>

<Example title="Dismissible" source={dismissingSource}>
  <Dismissing />
</Example>

<Example title="Autohide" source={autohideSource}>
  <Autohide />
</Example>

<Example title="Events" source={eventsSource}>
  <Events />
</Example>
