<script lang="typescript">
  import Example from '../Example.svelte';
  import Colors from './Colors.svelte';
  import Disabled from './Disabled.svelte';
  import Groups from './Groups.svelte';
  import Outline from './Outline.svelte';
  import Sizes from './Sizes.svelte';
  import Toolbars from './Toolbars.svelte';
  import disabledSource from '!!raw-loader!./Disabled.svelte';
  import groupsSource from '!!raw-loader!./Groups.svelte';
  import outlineSource from '!!raw-loader!./Outline.svelte';
  import sizesSource from '!!raw-loader!./Sizes.svelte';
  import source from '!!raw-loader!./Colors.svelte';
  import toolbarsSource from '!!raw-loader!./Toolbars.svelte';
</script>

<h1>Buttons</h1>
<a href="https://getbootstrap.com/docs/4.3/components/buttons/" target="_blank">
  Bootstrap Buttons
</a>

<Example title="Colors" {source}>
  <Colors />
</Example>

<Example title="Outline" source={outlineSource}>
  <Outline />
</Example>

<Example title="Disabled" source={disabledSource}>
  <Disabled />
</Example>

<Example title="Sizes" source={sizesSource}>
  <Sizes />
</Example>

<Example title="ButtonGroups" source={groupsSource}>
  <Groups />
</Example>

<Example title="ButtonToolbars" source={toolbarsSource}>
  <Toolbars />
</Example>
