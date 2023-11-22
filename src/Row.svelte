<script>
  import classnames from './utils.ts';

  let className = '';
  export { className as class };
  export let noGutters = false;
  export let form = false;
  export let cols = 0;
  export let inner = undefined;

  function getCols(cols) {
    const colsValue = parseInt(cols);
    if (!isNaN(colsValue)) {
      if (colsValue > 0) {
        return [`row-cols-${colsValue}`];
      }
    } else if (typeof cols === 'object') {
      return ['xs', 'sm', 'md', 'lg', 'xl']
        .map((colWidth) => {
          const isXs = colWidth === 'xs';
          const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
          const value = cols[colWidth];
          if (typeof value === 'number' && value > 0) {
            return `row-cols${colSizeInterfix}${value}`;
          }
          return null;
        })
        .filter((value) => !!value);
    }
    return [];
  }

  $: classes = classnames(
    className,
    noGutters ? 'gx-0' : null,
    form ? 'form-row' : 'row',
    ...getCols(cols)
  );
</script>

<div {...$$restProps} class={classes} bind:this={inner}>
  <slot />
</div>
