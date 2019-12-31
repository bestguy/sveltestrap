<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let disabled = false;
  export let active = false;
  export let href = '#';

  const props = clean($$props);

  $: classes = clsx(className, 'nav-link', {
    disabled,
    active
  });

  function handleClick(e) {
    if (disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    if (href === '#') {
      e.preventDefault();
    }
  }
</script>

<a {...props} {href} on:click on:click={handleClick} class={classes}>
  <slot />
</a>
