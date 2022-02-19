<script lang="ts">
  import type { ButtonColor } from 'src/Button';
  import { Button } from 'sveltestrap';

  const colors: ButtonColor[] = [
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
    <Button outline {color}>{color}</Button>
  </div>
{/each}

<div>
  <Button href="/" outline color="primary">button with href</Button>
</div>
