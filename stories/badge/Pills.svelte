<script>
  import { Badge } from 'sveltestrap';

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
  <div>
    <Badge pill {color}>{color}</Badge>
  </div>
{/each}
