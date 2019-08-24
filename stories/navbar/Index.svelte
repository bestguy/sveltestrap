<script>
  import Example from '../Example.svelte';
  import Colors from './Colors.svelte';
  import colorsSource from '!!raw-loader!./Colors.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Toggler from './Toggler.svelte';
  import togglerSource from '!!raw-loader!./Toggler.svelte';
</script>

<h1>Navbar</h1>
<a href="https://getbootstrap.com/docs/4.3/components/navbar/" target="_blank">
  Bootstrap Navbar
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Colors" source={colorsSource} stacked>
  <p slot="info">
    Change the Navbar's background color using the <code>color</code> prop.
    Use the <code>light</code> or <code>dark</code> props to change
    Navbar text color for lighter or darker <code>color</code> values.
  </p>
  <Colors />
</Example>

<Example title="Toggler" source={togglerSource} stacked>
  <Toggler />
</Example>

<!-- TODO Add {fixed} {expand} sample -->