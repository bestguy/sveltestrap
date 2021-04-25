<script lang="ts">
  import Example from '../Example.svelte';
  import Colors from './Colors.svelte';
  import colorsSource from '!!raw-loader!./Colors.svelte';
  import Dismissible from './Dismissible.svelte';
  import dismissibleSource from '!!raw-loader!./Dismissible.svelte';
  import NoFade from './NoFade.svelte';
  import noFadeSource from '!!raw-loader!./NoFade.svelte';
  import uncontrolledSource from '!!raw-loader!./Uncontrolled.svelte';
  import Uncontrolled from './Uncontrolled.svelte';
</script>

<h1>Alerts</h1>
<a href="https://getbootstrap.com/docs/4.5/components/alerts/" target="_blank">
  Bootstrap Alerts
</a>

<Example title="Colors" source={colorsSource}>
  <Colors />
</Example>

<Example title="Dismissible" source={dismissibleSource}>
  <Dismissible />
</Example>

<Example title="Uncontrolled Alerts" source={uncontrolledSource}>
  <p slot="info">
    For the most basic use-case an uncontrolled component can provide the
    functionality wanted without the need to manage/control the state of the
    component. UncontrolledAlert does not require isOpen nor toggle props to
    work.
  </p>
  <Uncontrolled />
</Example>

<Example title="Alerts without fade" source={noFadeSource}>
  <p slot="info">
    Fade can be disabled using
    <code>fade=false</code>
    .
  </p>
  <NoFade />
</Example>
