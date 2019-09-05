<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };

  const props = clean($$props);

  $: classes = clsx(
    className,
    'card-subtitle',
  );
</script>


<div {...props} class="{classes}">
  <slot />
</div>
