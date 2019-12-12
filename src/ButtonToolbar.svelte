<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let ariaLabel = '';
  // TEMP
  // export let role = 'toolbar';

  const props = clean($$props);

  $: classes = clsx(
    className,
    'btn-toolbar'
  );
</script>

<div {...props} aria-label="{ariaLabel}" class="{classes}">
  <slot />
</div>
