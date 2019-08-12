<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let href = '';

  $: classes = clsx(
    className,
    'card-link',
  );
</script>


<a class="{classes}" {href}>
  <slot />
</a>
