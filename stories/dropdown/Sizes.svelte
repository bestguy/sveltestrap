<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';

  let isOpen = false;
  let lgIsOpen = false;
  let smIsOpen = false;
</script>

<div class="mb-3">
  <Dropdown
    group
    isOpen={lgIsOpen}
    size="lg"
    toggle={() => (lgIsOpen = !lgIsOpen)}
  >
    <DropdownToggle caret>Large Dropdown</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Shave the modern way</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>

<div class="mb-3">
  <Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
    <DropdownToggle caret>Dropdown</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>No Brush, No Lather</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>

<div class="mb-3">
  <Dropdown
    group
    isOpen={smIsOpen}
    size="sm"
    toggle={() => (smIsOpen = !smIsOpen)}
  >
    <DropdownToggle caret>Small Dropdown</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Burma-Shave</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>
