<script>
  import { Toast, ToastBody, ToastHeader } from 'sveltestrap';
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
  <div class="p-3 bg-{color} mb-3">
    <Toast class="mr-1" {color}>
      <ToastHeader>Sveltestrap</ToastHeader>
      <ToastBody>
        This is a toast on a {color} background — check it out!
      </ToastBody>
    </Toast>
  </div>
{/each}
