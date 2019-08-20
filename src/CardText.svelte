<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'card-text',
  );
</script>


<p {...props} class="{classes}">
  <slot />
</p>
