<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let inline = false;
  export let color = 'muted';

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    !inline ? 'form-text' : false,
    color ? `text-${color}` : false
  );
</script>

<small class="{classes}" {...props}>
  <slot/>
</small>
