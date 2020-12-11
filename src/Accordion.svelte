<script>
  import classnames from './utils';
  import { createEventDispatcher, setContext } from 'svelte';
  import { writable } from 'svelte/store';

  const dispatch = createEventDispatcher();

  export { className as class };

  let className = '';
  $: classes = classnames(className, 'accordion');

  const open = writable();
  setContext('accordion', {
    open,
    toggle: (id) => {
      if ($open === id) open.set();
      else open.set(id);

      dispatch('toggle', {
        [id]: $open === id
      });
    }
  });
</script>

<div class={classes} {...$$restProps}>
  <slot />
</div>
