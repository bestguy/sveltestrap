<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };

  $: classes = clsx(
    className,
    'toast-body',
  );
</script>

<div class="{classes}">
  <slot />
</div>
