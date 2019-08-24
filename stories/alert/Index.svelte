<script>
  import { Col, Row } from 'sveltestrap';
  import Example from '../Example.svelte';
  import Colors from './Colors.svelte';
  import colorsSource from '!!raw-loader!./Colors.svelte';
  import Dismissable from './Dismissable.svelte';
  import dismissableSource from '!!raw-loader!./Dismissable.svelte';
  import NoFade from './NoFade.svelte';
  import noFadeSource from '!!raw-loader!./NoFade.svelte';
  import Uncontrolled from './Uncontrolled.svelte';
  import uncontrolledSource from '!!raw-loader!./Uncontrolled.svelte';
</script>

<h1>Alerts</h1>
<a href="https://getbootstrap.com/docs/4.3/components/alerts/" target="_blank">
  Bootstrap Alerts
</a>

<Example title="Colors" source={colorsSource}>
  <Colors />
</Example>

<Example title="Dismissable" source={dismissableSource}>
  <Dismissable />
</Example>

<Example title="Uncontrolled Alerts" source={uncontrolledSource}>
  <p slot="info">
    For the most basic use-case an uncontrolled component can provide the functionality wanted without the need to manage/control the state of the component.
    UncontrolledAlert does not require isOpen nor toggle props to work.
  </p>
  <NoFade />
</Example>

<Example title="Alerts without fade" source={noFadeSource}>
  <p slot="info">
    Fade can be disabled using <code>fade=false</code>.
  </p>
  <NoFade />
</Example>
