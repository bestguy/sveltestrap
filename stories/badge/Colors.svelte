<script lang="ts">
  import { Badge } from 'sveltestrap';

  const colors = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'primary-subtle',
    'secondary-subtle',
    'success-subtle',
    'danger-subtle',
    'warning-subtle',
    'info-subtle',
    'light-subtle',
    'dark-subtle'
  ];
</script>

{#each colors as color}
  <div>
    <Badge {color}>{color}</Badge>
  </div>
{/each}
