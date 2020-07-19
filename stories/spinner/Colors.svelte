<script>
  import { Spinner } from 'sveltestrap';
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
  <Spinner {color} />
{/each}
