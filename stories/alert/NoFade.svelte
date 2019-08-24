<script>
  import { Alert, UncontrolledAlert } from "sveltestrap";

  let visible = true;
</script>

<Alert
  color="primary"
  isOpen={visible}
  toggle={() => (visible = false)}
  fade={false}>
  I am a primary alert and I can be dismissed without animating!
</Alert>

<UncontrolledAlert color="info" fade={false}>
  I am an alert and I can be dismissed without animating!
</UncontrolledAlert>
