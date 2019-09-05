<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export {className as class};
  export let href = '/';

  const props = clean($$props);

  $: classes = clsx(
    className,
    'navbar-brand',
  );
</script>

<a {...props} class="{classes}" {href}>
  <slot/>
</a>
