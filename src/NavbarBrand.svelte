<script>
  import clsx from 'clsx';

  let className = '';
  export {className as class};
  export let href = '/';

  $: classes = clsx(
    className,
    'navbar-brand',
  );
</script>

<a class="{classes}" {href}>
  <slot/>
</a>
