<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let ariaLabel = '';
  export let role = 'toolbar';

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'btn-toolbar'
  );
</script>

<div {...props} aria-label="{ariaLabel}" class="{classes}">
  <slot />
</div>
