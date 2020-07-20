<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
  } from 'sveltestrap';
  let open = false;
  let size;
  const toggle = () => {
    size = undefined;
    open = !open;
  };
  const toggleLg = () => {
    size = 'lg';
    open = !open;
  };
  const toggleSm = () => {
    size = 'sm';
    open = !open;
  };
</script>

<div>
  <ButtonGroup>
    <Button color="success" on:click={toggleSm}>Open Small Modal</Button>
    <Button color="warning" on:click={toggle}>Open Default Modal</Button>
    <Button color="danger" on:click={toggleLg}>Open Large Modal</Button>
  </ButtonGroup>

  <Modal isOpen={open} {toggle} {size}>
    <ModalHeader {toggle}>Modal title</ModalHeader>
    <ModalBody>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={toggle}>Do Something</Button>
      <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
  </Modal>
</div>
