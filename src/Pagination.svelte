<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let listClassName = '';
  export let size = '';
  export let ariaLabel = 'pagination';

  const props = clean($$props);

  $: classes = clsx(className);

  $: listClasses = clsx(listClassName, 'pagination', {
    [`pagination-${size}`]: !!size
  });
</script>

<nav {...props} class={classes} aria-label={ariaLabel}>
  <ul class={listClasses}>
    <slot />
  </ul>
</nav>
