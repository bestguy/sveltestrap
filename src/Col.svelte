<script>
  import { getColumnSizeClass, isObject } from './utils';

  let className = '';
  export { className as class };
  export let xs = undefined;
  export let sm = undefined;
  export let md = undefined;
  export let lg = undefined;
  export let xl = undefined;
  export let xxl = undefined;

  const colClasses = [];
  const lookup = {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl
  };

  Object.keys(lookup).forEach((colWidth) => {
    const columnProp = lookup[colWidth];
    if (!columnProp && columnProp !== '') {
      return; //no value for this width
    }

    const isXs = colWidth === 'xs';

    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

      if (columnProp.size || columnProp.size === '') {
        colClasses.push(colClass);
      }
      if (columnProp.push) {
        colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
      }
      if (columnProp.pull) {
        colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
      }
      if (columnProp.offset) {
        colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
      }
    } else {
      colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    }
  });

  if (!colClasses.length) {
    colClasses.push('col');
  }

  if (className) {
    colClasses.push(className);
  }
</script>

<div {...$$restProps} class={colClasses.join(' ')}>
  <slot />
</div>
