<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import source from '!!raw-loader!./Sample.svelte';
  import Divider from './Divider.svelte';
  import dividerSource from '!!raw-loader!./Divider.svelte';
</script>

<h1>Breadcrumbs</h1>
<a
  href="https://getbootstrap.com/docs/5.3/components/breadcrumb/"
  target="_blank"
>
  Bootstrap Breadcrumbs
</a>

<Example {source}>
  <Sample />
</Example>

<Example title="Custom Divider" source={dividerSource}>
  <Divider />
</Example>
