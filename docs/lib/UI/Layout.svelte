<script>
	import Nav from './Nav.svelte';
	import Footer from './Footer.svelte';
	export let segment;
</script>

<div class="wrapper">
	<Nav {segment} />
	<slot />
	<Footer />
</div>
