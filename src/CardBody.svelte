<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let id = '';

  const props = clean($$props);

  $: classes = clsx(
    className,
    'card-body'
  );
</script>

<div {...props} {id} class="{classes}">
  <slot />
</div>
