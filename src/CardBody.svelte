<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let id = '';

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'card-body'
  );
</script>

<div {...props} {id} class="{classes}">
  <slot />
</div>
