<script lang="ts">
  import Example from '../Example.svelte';
  import Colors from './Colors.svelte';
  import colorsSource from '!!raw-loader!./Colors.svelte';
  import Controlled from './Controlled.svelte';
  import controlledSource from '!!raw-loader!./Controlled.svelte';
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

<Example title="Controlled Alerts" source={controlledSource}>
  <p slot="info">
    Alert provides the dismissible prop, but if you need to manually control the
    open state, you manage the <code>isOpen</code> and <code>toggle</code> prop.
  </p>
  <Controlled />
</Example>

<Example title="Alerts without fade" source={noFadeSource}>
  <p slot="info">
    Fade can be disabled using <code>fade=false</code>.
  </p>
  <NoFade />
</Example>
