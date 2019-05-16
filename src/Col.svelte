<script>
	import isobject from 'lodash.isobject';
	let clazz;
    export { clazz as class };

    export let id;

    const colClasses = [];
    if (clazz) {
    	colClasses.push(clazz);
    }

    const getColumnSizeClass = (isXs, colWidth, colSize) => {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    };

    const widths = ['xs', 'sm', 'md', 'lg', 'xl'];

    widths.forEach((colWidth) => {
        const columnProp = $$props[colWidth];
    	if (!columnProp && columnProp !== '') {
    		return; //no value for this width
    	}

    	const isXs = colWidth === 'xs';

    	if (isobject(columnProp)) {
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

</script>

<div {id} class="{colClasses.join(' ')}">
	<slot />
</div>
