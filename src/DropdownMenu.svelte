<script>
  import { getContext } from 'svelte';
  import classnames from './utils';

  const context = getContext('dropdownContext');

  let className = '';
  export { className as class };
  export let right = false;


  $: classes = classnames(className, 'dropdown-menu', {
    'dropdown-menu-right': right,
    show: $context.isOpen
  });
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
