<script>
	import Home from './Home/Home.svelte';
	import Layout from './UI/Layout.svelte';

	let currentPage;
	setCurrentPage();

	function handleHashChange(e) {
		setCurrentPage();
	}

	function getCurrentPage() {
		return window.location.hash.substring(1).replace('/', '');
	}

	function setCurrentPage() {
		currentPage = getCurrentPage() || 'Home';
		console.info('setting current page to', currentPage);
	}
</script>

<svelte:window on:hashchange="{handleHashChange}" />
<Layout>
	{#if currentPage === 'Home'}
		<Home />
	{:else}
		Unknown page {currentPage}
	{/if}
</Layout>
