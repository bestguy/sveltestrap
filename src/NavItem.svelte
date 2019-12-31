<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let active = false;

  const props = clean($$props);

  $: classes = clsx(className, 'nav-item', active ? 'active' : false);
</script>

<li {...props} class={classes}>
  <slot />
</li>
