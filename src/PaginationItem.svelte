<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export {className as class};
  export let active = false;
  export let disabled = false;

  const props = clean($$props);

  $: classes = clsx(
    className,
    'page-item',
    {
      active,
      disabled,
    },
  );
</script>

<li {...props} class="{classes}">
  <slot />
</li>
