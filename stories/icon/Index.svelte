<script lang="ts">
  import { Alert } from 'sveltestrap';
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<h1>Icon</h1>
<a href="https://icons.getbootstrap.com" target="_blank">
  Bootstrap Icons
</a>

<Alert color="info">
  <b>Note:</b> This component uses a CDN URL for the Bootstrap Icon file:
  <code>https://cdn.jsdelivr.net/gh/twbs/icons/bootstrap-icons.svg</code>.<br />
  You can customize this using the <code>url</code> prop, for example:
  <code>&lt;Icon name="whatever" url="/bootstrap-icons.svg" /&gt;</code>
</Alert>

<Example source={sampleSource}>
  <Sample />
</Example>
