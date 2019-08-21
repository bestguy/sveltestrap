<script>
  import clsx from 'clsx';

  let className = '';
  export {className as class};
  export let active = false;

  $: classes = clsx(
    className,
    'nav-item',
    active ? 'active' : false
  );
</script>

<li class="{classes}">
  <slot/>
</li>
