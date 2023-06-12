<script lang="ts">
  import { Progress } from 'sveltestrap';

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

{#each colors as color, i}
  <Progress {color} value={Math.random() * 50 + 50} class="mb-2">
    {color}
  </Progress>
{/each}
