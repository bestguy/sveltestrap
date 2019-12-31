<script>
  import { getContext } from 'svelte';
  import clsx from 'clsx';
  import { clean } from './utils';

  const context = getContext('dropdownContext');

  let className = '';
  export { className as class };
  export let right = false;

  const props = clean($$props);

  $: classes = clsx(className, 'dropdown-menu', {
    'dropdown-menu-right': right,
    show: $context.isOpen
  });
</script>

<div {...props} class={classes}>
  <slot />
</div>
