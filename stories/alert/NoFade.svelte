<script lang="ts">
  import { Alert } from 'sveltestrap';

  let visible = true;
</script>

<Alert
  color="primary"
  isOpen={visible}
  toggle={() => (visible = false)}
  fade={false}>
  I am a primary alert and I can be dismissed without animating!
</Alert>

<Alert color="info" fade={false} dismissible>
  I am a dismissible alert and I can be dismissed without animating!
</Alert>
