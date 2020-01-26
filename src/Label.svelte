<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  import { getColumnSizeClass, isObject } from './utils';

  let className = '';

  const props = clean($$props);

  export { className as class };
  export let hidden = false;
  export let check = false;
  export let size = '';
  export let fore;
  export { fore as for };
  export let id = '';
  export let xs = '';
  export let sm = '';
  export let md = '';
  export let lg = '';
  export let xl = '';

  const colWidths = {
    xs,
    sm,
    md,
    lg,
    xl
  };
  export let widths = Object.keys(colWidths);

  const colClasses = [];

  Object.keys(colWidths).forEach(colWidth => {
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
        clsx({
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

  $: classes = clsx(
    className,
    hidden ? 'sr-only' : false,
    check ? 'form-check-label' : false,
    size ? `col-form-label-${size}` : false,
    colClasses,
    colClasses.length ? 'col-form-label' : false
  );
</script>

<label {...props} {id} class={classes} for={fore}>
  <slot />
</label>
