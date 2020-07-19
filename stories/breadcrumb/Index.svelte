<script lang="typescript">
  import { Col, Row } from 'sveltestrap';
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import source from '!!raw-loader!./Sample.svelte';
</script>

<h1>Breadcrumbs</h1>
<a
  href="https://getbootstrap.com/docs/4.3/components/breadcrumb/"
  target="_blank">
  Bootstrap Breadcrumbs
</a>

<Example {source}>
  <Sample />
</Example>
