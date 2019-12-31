<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let type = 'border';
  export let size = '';
  export let color = '';

  const props = clean($$props);

  $: classes = clsx(
    className,
    size ? `spinner-${type}-${size}` : false,
    `spinner-${type}`,
    color ? `text-${color}` : false
  );
</script>

<div {...props} role="status" class={classes}>
  <span class="sr-only">
    <slot>Loading...</slot>
  </span>
</div>
