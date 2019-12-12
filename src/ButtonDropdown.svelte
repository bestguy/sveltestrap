<script>
  import Dropdown from './Dropdown.svelte';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let active = false;
  export let addonType = false;
  export let direction = 'down';
  export let disabled = false;
  export let dropup = false;
  export let group = false;
  export let inNavbar = false;
  export let isOpen = false;
  export let nav = false;
  export let setActiveFromChild = false;
  export let size = '';
  export let toggle = undefined;

  const props = clean($$props);
</script>

<Dropdown
  {...props}
  {group}
  class={className}
  {disabled}
  {direction}
  {isOpen}
  {nav}
  {active}
  {addonType}
  {size}
  {toggle}
  {inNavbar}
  {setActiveFromChild}
  {dropup}
  on:click
>
  <slot />
</Dropdown>
