<script>
  import Example from '../Example.svelte';
  import Actions from './Actions.svelte';
  import Colors from './Colors.svelte';
  import Flush from './Flush.svelte';
  import Sample from './Sample.svelte';
  import actionsSource from '!!raw-loader!./Actions.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import colorsSource from '!!raw-loader!./Flush.svelte';
  import flushSource from '!!raw-loader!./Colors.svelte';
</script>

<h1>List Groups</h1>
<a href="https://getbootstrap.com/docs/4.3/components/list-group/" target="_blank">
  Bootstrap List Groups
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Colors" source={colorsSource}>
  <Colors />
</Example>

<Example title="Actions" source={actionsSource}>
  <p slot="info">
    The <code>action</code> prop will fill the ListGroupItem with the clickable area for anchors and buttons.
  </p>
  <Actions />
</Example>

<Example title="Flush" source={flushSource}>
  <Flush />
</Example>

