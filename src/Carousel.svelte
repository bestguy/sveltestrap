<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let id = '';
  export let style = '';

  $: classes = clsx(
    className,
    'carousel',
    'slide',
  );
</script>

<div id="{id}" class="{classes}" {style}>
  <slot />
</div>
