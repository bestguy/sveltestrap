<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let noGutters = false;
  export let form = false;
  export let id = '';
  export let cols = 0;

  function getCols(cols) {
    if (typeof cols === 'number') {
      if (cols > 0) {
        return [`row-cols-${cols}`];
      }
    }
    else if (typeof cols === 'object') {
      return ['xs', 'sm', 'md', 'lg', 'xl'].map((colWidth) => {
        const isXs = colWidth === 'xs';
        const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
        const value = cols[colWidth];
        if (typeof value === 'number' && value > 0) {
          return `row-cols${colSizeInterfix}${value}`;
        }
        return null;
      }).filter((value) => !!value);
    }
    return [];
  }

  const props = clean($$props);

  $: classes = clsx(
    className,
    noGutters ? 'no-gutters' : null,
    form ? 'form-row' : 'row',
    ...getCols(cols),
  );
</script>

<div {...props} {id} class="{classes}">
  <slot />
</div>
