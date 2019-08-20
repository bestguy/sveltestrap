<script>
  import { getContext } from 'svelte';
  import clsx from 'clsx';

  const context = getContext("dropdownContext");

  let className = '';
  export { className as class };
  export let right = false;
  export let flip = true;
  export let persist = false;

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'dropdown-menu',
    {
      'dropdown-menu-right': right,
      show: $context.isOpen,
    },
  );
</script>

<div {...props} class="{classes}">
  <slot />
</div>
