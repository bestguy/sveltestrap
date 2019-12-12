<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export {className as class};
  export let light = false;
  export let dark = false;
  // TEMP
  // export let full = false;
  export let fixed = '';
  export let sticky = '';
  export let color = '';
  // TEMP
  // export let role = '';
  export let expand = false;

  const props = clean($$props);

  function getExpandClass(expand) {
    if (expand === false) {
      return false;
    } else if (expand === true || expand === 'xs') {
      return 'navbar-expand';
    }

    return `navbar-expand-${expand}`;
  }

  $: classes = clsx(
    className,
    'navbar',
    getExpandClass(expand),
    {
      'navbar-light': light,
      'navbar-dark': dark,
      [`bg-${color}`]: color,
      [`fixed-${fixed}`]: fixed,
      [`sticky-${sticky}`]: sticky,
    },
  );
</script>

<nav {...props} class="{classes}">
  <slot />
</nav>
