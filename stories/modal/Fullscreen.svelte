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
  let fullscreen: any;
  const toggle = () => {
    fullscreen = undefined;
    open = !open;
  };
  const toggleLg = () => {
    fullscreen = 'lg';
    open = !open;
  };
  const toggleMd = () => {
    fullscreen = 'md';
    open = !open;
  };
  const toggleSm = () => {
    fullscreen = 'sm';
    open = !open;
  };
  const toggleXl = () => {
    fullscreen = 'xl';
    open = !open;
  };
  const toggleAlways = () => {
    fullscreen = true;
    open = !open;
  };
</script>

<div>
  <ButtonGroup>
    <Button color="success" on:click={toggleSm}>Open Small Modal</Button>
    <Button color="warning" on:click={toggleMd}>Open Medium Modal</Button>
    <Button color="danger" on:click={toggleLg}>Open Large Modal</Button>
    <Button color="dark" on:click={toggleXl}>Open Extra Large Modal</Button>
    <Button color="primary" on:click={toggleAlways}>Open Always Modal</Button>
  </ButtonGroup>

  <Modal isOpen={open} {toggle} {fullscreen}>
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
