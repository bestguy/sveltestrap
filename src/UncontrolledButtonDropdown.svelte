<script>
  import ButtonDropdown from './ButtonDropdown.svelte';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let disabled = false;
  export let group = false;
  export let nav = false;
  export let active = false;
  export let addonType = false;
  export let size = '';
  export let inNavbar = false;
  export let setActiveFromChild = false;
  export let dropup = false;
  export let defaultOpen = false;

  let isOpen = defaultOpen;
  const props = clean($$props);
</script>

<ButtonDropdown
  {...props}
  {isOpen}
  toggle={() => (isOpen = !isOpen)}
  class={className}
  {disabled}
  {group}
  {nav}
  {active}
  {addonType}
  {size}
  {inNavbar}
  {setActiveFromChild}
  {dropup}
>
  <slot />
</ButtonDropdown>
