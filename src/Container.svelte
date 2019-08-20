<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let fluid = false;
  export let id = '';

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    fluid ? 'container-fluid' : 'container',
  );
</script>

<div {...props} {id} class="{classes}">
  <slot />
</div>
