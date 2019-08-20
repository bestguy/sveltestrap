<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let inline = false;

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    inline ? 'form-inline' : false,
  );
</script>

<form {...props} class="{classes}">
  <slot />
</form>
