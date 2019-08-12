<script>
  import clsx from 'clsx';

  let className = '';
  export {className as class};
  export let flush = false;

  $: classes = clsx(
    className,
    'list-group',
    flush ? 'list-group-flush' : false,
  );
</script>

<ul class="{classes}">
  <slot/>
</ul>
