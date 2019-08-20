<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let href = '';

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'card-link',
  );
</script>


<a {...props} class="{classes}" {href}>
  <slot />
</a>
