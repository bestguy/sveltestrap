<script>
	import Nav from './Nav.svelte';
	import Footer from './Footer.svelte';
</script>

<div class="wrapper">
	<Nav />
	<slot />
	<Footer />
</div>
