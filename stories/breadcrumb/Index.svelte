<script lang="ts">
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import source from '!!raw-loader!./Sample.svelte';
</script>

<h1>Breadcrumbs</h1>
<a
  href="https://getbootstrap.com/docs/5.0/components/breadcrumb/"
  target="_blank">
  Bootstrap Breadcrumbs
</a>

<Example {source}>
  <Sample />
</Example>
