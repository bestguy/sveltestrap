<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };

  $: classes = clsx(
    className,
    'card-group',
  );
</script>

<div class="{classes}">
  <slot />
</div>
