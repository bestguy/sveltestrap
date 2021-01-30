<script lang="ts">
  import { Alert } from 'sveltestrap';
  import Example from '../Example.svelte';
  import Controlled from './Controlled.svelte';
  import Dismissible from './Dismissible.svelte';
  import Sample from './Sample.svelte';
  import Slots from './Slots.svelte'
  import Triggers from './Triggers.svelte'
  import controlledSource from '!!raw-loader!./Controlled.svelte';
  import dismissibleSource from '!!raw-loader!./Dismissible.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import slotsSource from '!!raw-loader!./Slots.svelte';
  import triggersSource from '!!raw-loader!./Triggers.svelte';
</script>

<h1>Popover</h1>
<a href="https://getbootstrap.com/docs/4.5/components/popovers/" target="_blank">
  Bootstrap Popover
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Slots" source={slotsSource}>
  <Slots />
</Example>

<Example title="Trigger" source={triggersSource}>
  <Triggers />
</Example>

<Example title="Dismissible" source={dismissibleSource}>
  <div slot="info">
    <Alert color="info">
      <b>Note:</b>
      For proper cross-browser and cross-platform behavior for dismiss-on-next-click,
      you must use the &lt;a&gt; tag, not the &lt;Button&gt; tag,
      and you also must include a tabindex attribute.
    </Alert>
  </div>
  <Dismissible />
</Example>

<Example title="Controlled" source={controlledSource}>
  <Controlled />
</Example>