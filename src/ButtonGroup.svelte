<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let id = '';
  export let size = '';
  export let vertical = false;

  const props = clean($$props);

  $: classes = clsx(
    className,
    size ? `btn-group-${size}` : false,
    vertical ? 'btn-group-vertical' : 'btn-group',
  );

</script>

<div {...props} {id} class="{classes}">
  <slot />
</div>
