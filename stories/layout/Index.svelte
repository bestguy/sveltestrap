<script lang="ts">
  import Example from '../Example.svelte';
  import Container from './Container.svelte';
  import containerSource from '!!raw-loader!./Container.svelte';
</script>

<h1>Containers</h1>
<a href="https://getbootstrap.com/docs/5.3/layout/containers/" target="_blank">
  Bootstrap Containers
</a>

<Example title="Container" stacked source={containerSource}>
  <Container />
</Example>
