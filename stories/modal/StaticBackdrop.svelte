<script lang="ts">
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
  } from 'sveltestrap';
  let open = false;
  const toggle = () => (open = !open);
</script>

<div>
  <Button color="danger" on:click={toggle}>Modal with Static Backdrop</Button>
  <Modal isOpen={open} backdrop="static" {toggle}>
    <ModalHeader {toggle}>Modal title</ModalHeader>
    <ModalBody>
      Clicking outside modal or hitting Escape does not dismiss.
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={toggle}>Do Something</Button>
      <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
  </Modal>
</div>
