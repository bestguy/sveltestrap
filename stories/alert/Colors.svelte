<script>
  import { Alert } from 'sveltestrap';

  const colors = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ];
</script>

{#each colors as color}
  <Alert {color}>
    <h4 class="alert-heading text-capitalize">{color}</h4>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    <a href="#todo" class="alert-link">
      Also, alert-links are colored to match
    </a>
    .
  </Alert>
{/each}
