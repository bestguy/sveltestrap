<script>
  import clsx from 'clsx';

  let className = '';
    export { className as class };
    export let size = '';
    export let vertical = false;
    export let id = '';

    $: classes = clsx(
      className,
      size ? `btn-group-${size}` : false,
      vertical ? 'btn-group-vertical' : 'btn-group',
  );

</script>

<div {id} class="{classes}">
  <slot />
</div>
