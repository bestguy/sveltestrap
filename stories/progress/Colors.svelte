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
    'dark'
  ];
</script>

{#each colors as color, i}
  <Progress {color} value={Math.random() * 50 + 50} class="mb-2">
    {color}
  </Progress>
{/each}
