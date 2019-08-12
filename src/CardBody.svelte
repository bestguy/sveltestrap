<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let id = '';

  $: classes = clsx(
    className,
    'card-body'
  );
</script>

<div {id} class="{classes}">
  <slot />
</div>
