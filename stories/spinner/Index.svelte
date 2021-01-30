<script lang="ts">
  import Example from '../Example.svelte';
  import Colors from './Colors.svelte';
  import Size from './Size.svelte';
  import Type from './Type.svelte';
  import colorsSource from '!!raw-loader!./Colors.svelte';
  import sizeSource from '!!raw-loader!./Size.svelte';
  import typeSource from '!!raw-loader!./Type.svelte';
</script>

<h1>Spinner</h1>
<a
  href="https://getbootstrap.com/docs/4.5/components/spinners/"
  target="_blank">
  Bootstrap Spinner
</a>

<Example title="Colors" source={colorsSource}>
  <Colors />
</Example>

<Example title="Types" source={typeSource}>
  <Type />
</Example>

<Example title="Sizes" source={sizeSource}>
  <Size />
</Example>
