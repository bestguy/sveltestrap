<script lang="ts">
  import Example from '../Example.svelte';
  import Colors from './Colors.svelte';
  import colorsSource from '!!raw-loader!./Colors.svelte';
  import Dismissible from './Dismissible.svelte';
  import dismissibleSource from '!!raw-loader!./Dismissible.svelte';
  import NoFade from './NoFade.svelte';
  import noFadeSource from '!!raw-loader!./NoFade.svelte';
</script>

<h1>Alerts</h1>
<a href="https://getbootstrap.com/docs/5.0/components/alerts/" target="_blank">
  Bootstrap Alerts
</a>

<Example title="Colors" source={colorsSource}>
  <Colors />
</Example>

<Example title="Dismissible" source={dismissibleSource}>
  <Dismissible />
</Example>

<Example title="Alerts without fade" source={noFadeSource}>
  <p slot="info">
    Fade can be disabled using
    <code>fade=false</code>
    .
  </p>
  <NoFade />
</Example>
