<script>
  import Button from "../src/Button.svelte";
  import Modal from "../src/Modal.svelte";
  import ModalHeader from "../src/ModalHeader.svelte";
  import ModalBody from "../src/ModalBody.svelte";
  import ModalFooter from "../src/ModalFooter.svelte";

  let open = false;
  const toggle = () => open = !open;
</script>

<div>
  <Button color="danger" on:click={toggle}>Open</Button>
  <Modal
    isOpen={open}
    toggle={toggle}
  >
    <ModalHeader toggle={toggle}>Modal title</ModalHeader>
    <ModalBody>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={toggle}>Do Something</Button>
      <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
  </Modal>
</div>
