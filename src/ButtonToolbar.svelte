<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let ariaLabel = '';

  const props = clean($$props);

  $: classes = clsx(className, 'btn-toolbar');
</script>

<div {...props} aria-label={ariaLabel} role="toolbar" class={classes}>
  <slot />
</div>
