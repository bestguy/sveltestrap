<script lang="ts">
  import { Button, Icon, Modal } from 'sveltestrap';
  let open = false;
  const toggle = () => (open = !open);
</script>

<div>
  <Button color="danger" on:click={toggle}>Open Modal</Button>
  <Modal isOpen={open} {toggle} body>
    <div slot="external" class="text-end">
      <Button
        color="link"
        class="text-white"
        size="lg"
        on:click={toggle}>
        <Icon name="x" class="h1" />
      </Button>
    </div>
    <h4>You can add content outside the Modal.</h4>
    <p>
      Click the X on right to close.
    </p>
  </Modal>
</div>
