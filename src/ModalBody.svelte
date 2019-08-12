<script>
  import clsx from 'clsx';

  let className = '';
  export {className as class};

  $: classes = clsx(
    className,
    'modal-body',
  );
</script>

<div class="{classes}">
  <slot />
</div>
