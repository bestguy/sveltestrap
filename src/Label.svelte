<script>
  import classnames from './utils';

  import { getColumnSizeClass, isObject } from './utils';

  let className = '';

  export { className as class };
  export let hidden = false;
  export let check = false;
  export let size = '';
  export let fore = null;
  export { fore as for };
  export let xs = '';
  export let sm = '';
  export let md = '';
  export let lg = '';
  export let xl = '';
  export let xxl = '';

  const colWidths = {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl
  };
  export let widths = Object.keys(colWidths);

  const colClasses = [];

  widths.forEach((colWidth) => {
    let columnProp = $$props[colWidth];

    if (!columnProp && columnProp !== '') {
      return;
    }

    const isXs = colWidth === 'xs';
    let colClass;

    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
      colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

      colClasses.push(
        classnames({
          [colClass]: columnProp.size || columnProp.size === '',
          [`order${colSizeInterfix}${columnProp.order}`]:
            columnProp.order || columnProp.order === 0,
          [`offset${colSizeInterfix}${columnProp.offset}`]:
            columnProp.offset || columnProp.offset === 0
        })
      );
    } else {
      colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });

  $: classes = classnames(
    className,
    hidden ? 'visually-hidden' : false,
    check ? 'form-check-label' : false,
    size ? `col-form-label-${size}` : false,
    colClasses,
    colClasses.length ? 'col-form-label' : 'form-label'
  );
</script>

<label {...$$restProps} class={classes} for={fore}>
  <slot />
</label>
