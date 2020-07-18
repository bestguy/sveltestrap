<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let light = false;
  export let dark = false;
  export let fixed = '';
  export let sticky = '';
  export let color = '';
  export let expand = false;


  function getExpandClass(expand) {
    if (expand === false) {
      return false;
    } else if (expand === true || expand === 'xs') {
      return 'navbar-expand';
    }

    return `navbar-expand-${expand}`;
  }

  $: classes = classnames(className, 'navbar', getExpandClass(expand), {
    'navbar-light': light,
    'navbar-dark': dark,
    [`bg-${color}`]: color,
    [`fixed-${fixed}`]: fixed,
    [`sticky-${sticky}`]: sticky
  });
</script>

<nav {...$$restProps} class={classes}>
  <slot />
</nav>
