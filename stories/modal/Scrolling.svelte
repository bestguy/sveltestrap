<script lang="ts">
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
  } from 'sveltestrap';
  let open = false;
  let openScrollable = false;
  const toggle = () => (open = !open);
  const toggleScrollable = () => (openScrollable = !openScrollable);
</script>

<div>
  <Button color="primary" on:click={toggle}>Default scrolling</Button>
  <Button color="success" on:click={toggleScrollable}>Scrollable modal body</Button>
  <Modal isOpen={open} {toggle}>
    <ModalHeader {toggle}>Modal title</ModalHeader>
    <ModalBody>
      <p style="min-height: 1500px;">This is some placeholder content to show the scrolling behavior for modals. Instead of repeating the text the modal, we use an inline style set a minimum height, thereby extending the length of the overall modal and demonstrating the overflow scrolling. When content becomes longer than the height of the viewport, scrolling will move the modal as needed.</p>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={toggle}>Do Something</Button>
      <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={openScrollable} toggle={toggleScrollable} scrollable>
    <ModalHeader toggle={toggleScrollable}>Modal title</ModalHeader>
    <ModalBody>
      <p style="min-height: 1500px;">This is some placeholder content to show the scrolling behavior for modals. Instead of repeating the text the modal, we use an inline style set a minimum height, thereby extending the length of the overall modal and demonstrating the overflow scrolling. When content becomes longer than the height of the viewport, scrolling will move the modal as needed.</p>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={toggleScrollable}>Do Something</Button>
      <Button color="secondary" on:click={toggleScrollable}>Cancel</Button>
    </ModalFooter>
  </Modal>
</div>
