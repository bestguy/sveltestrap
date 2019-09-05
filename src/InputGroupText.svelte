<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };

  const props = clean($$props);

  $: classes = clsx(
    className,
    'input-group-text',
  );
</script>

<span {...props} class="{classes}">
  <slot />
</span>
