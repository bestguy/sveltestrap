<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let size = '';

  const props = clean($$props);

  $: classes = clsx(
    className,
    'input-group',
    size ? `input-group-${size}` : null
  );
</script>

<div {...props} class={classes}>
  <slot />
</div>
