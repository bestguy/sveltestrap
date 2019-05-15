<script>
	let clazz;
    export { clazz as class };
    export let size;
    export let vertical = false;

    const classNames = [
    	vertical ? 'btn-group-vertical' : 'btn-group'
    ];

    if (clazz) {
    	classNames.push(clazz);
    }

    if (size) {
    	classNames.push(`btn-group-${size}`);
    }

</script>

<div class="{classNames.join(' ')}">
	<slot />
</div>
