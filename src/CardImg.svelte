<script>
	let clazz = '';
	export { clazz as class };
	export let top = false;
	export let bottom = false;
	export let src;
	let classes = '';
	$: {
		let cardImgClassName = 'card-img';
		if (top) {
			cardImgClassName = 'card-img-top';
		}
		if (bottom) {
			cardImgClassName = 'card-img-bottom';
		}
		classes = `${clazz} card-group`;
	}
</script>

<img class="{classes}" {src} />
