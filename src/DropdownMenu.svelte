<script>
  import { getContext } from 'svelte';
  import classnames from './utils';

  const context = getContext('dropdownContext');

  let className = '';
  export { className as class };
  export let dark = false;
  export let end = false;
  export let right = false;

  const popperPlacement = (direction, end) => {
    let prefix = direction;
    if (direction === 'up') prefix = 'top';
    else if (direction === 'down') prefix = 'bottom';

    let suffix = end ? 'end' : 'start';
    return `${prefix}-${suffix}`;
  };

  $: popperOptions = {
    modifiers: [
      { name: 'flip' },
      {
        name: 'offset',
        options: {
          offset: [0, 2]
        }
      }
    ],
    placement: popperPlacement($context.direction, end || right)
  };

  $: classes = classnames(className, 'dropdown-menu', {
    'dropdown-menu-dark': dark,
    'dropdown-menu-end': end || right,
    show: $context.isOpen
  });
</script>

<div
  {...$$restProps}
  class={classes}
  data-bs-popper={$context.inNavbar ? 'static' : undefined}
  use:$context.popperContent={popperOptions}
>
  <slot />
</div>
