<script lang="ts">
  import Example from '../Example.svelte';
  import Body from './Body.svelte';
  import bodySource from '!!raw-loader!./Body.svelte';
  import Colors from './Colors.svelte';
  import colorsSource from '!!raw-loader!./Colors.svelte';
  import Header from './Header.svelte';
  import headerSource from '!!raw-loader!./Header.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<h1>Card</h1>
<a href="https://getbootstrap.com/docs/4.5/components/card/" target="_blank">
  Bootstrap Card
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Body shorthand" source={bodySource}>
  <Body />
</Example>

<Example title="Headers and Footers" source={headerSource}>
  <Header />
</Example>

<Example title="Colors & Inverse" source={colorsSource}>
  <Colors />
</Example>
