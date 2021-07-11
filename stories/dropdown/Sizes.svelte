<script lang="ts">
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';
</script>

<div class="mb-3">
  <Dropdown group size="lg">
    <DropdownToggle caret>Large Dropdown</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Shave the modern way</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>

<div class="mb-3">
  <Dropdown>
    <DropdownToggle caret>Dropdown</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>No Brush, No Lather</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>

<div class="mb-3">
  <Dropdown group size="sm">
    <DropdownToggle caret>Small Dropdown</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Burma-Shave</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>
