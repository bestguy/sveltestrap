<script lang="ts">
  import { Icon, Toast, ToastBody, ToastHeader } from 'sveltestrap';
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
  <div class="p-3 mb-3">
    <Toast class="me-1" {color}>
      <ToastHeader icon={color}>{color}</ToastHeader>
      <ToastBody>
        This is a toast with a {color} icon.
      </ToastBody>
    </Toast>
  </div>
{/each}

<div class="p-3 mb-3">
  <Toast class="me-1">
    <ToastHeader>
      <Icon slot="icon" name="emoji-sunglasses" class="me-2" />
      Sveltestrap
    </ToastHeader>
    <ToastBody>This is a toast with a custom icon.</ToastBody>
  </Toast>
</div>
