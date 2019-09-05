<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export {className as class};
  export let tabs = false;
  export let pills = false;
  export let vertical = false;
  export let horizontal = '';
  export let justified = false;
  export let fill = false;
  export let navbar = false;
  export let card = false;

  const props = clean($$props);

  function getVerticalClass(vertical) {
    if (vertical === false) {
      return false;
    } else if (vertical === true || vertical === 'xs') {
      return 'flex-column';
    }
    return `flex-${vertical}-column`;
  }

  $: classes = clsx(
    className,
    navbar ? 'navbar-nav' : 'nav',
    horizontal ? `justify-content-${horizontal}` : false,
    getVerticalClass(vertical),
    {
      'nav-tabs': tabs,
      'card-header-tabs': card && tabs,
      'nav-pills': pills,
      'card-header-pills': card && pills,
      'nav-justified': justified,
      'nav-fill': fill,
    },
  );
</script>

<ul {...props} class="{classes}">
  <slot />
</ul>
