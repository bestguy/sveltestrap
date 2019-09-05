<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export {className as class};
  export let flush = false;

  const props = clean($$props);

  $: classes = clsx(
    className,
    'list-group',
    flush ? 'list-group-flush' : false,
  );
</script>

<ul {...props} class="{classes}">
  <slot/>
</ul>
