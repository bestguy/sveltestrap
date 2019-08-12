<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let fluid = false;
  export let id = '';

  $: classes = clsx(
    className,
    fluid ? 'container-fluid' : 'container',
  );
</script>

<div {id} class="{classes}">
  <slot />
</div>
