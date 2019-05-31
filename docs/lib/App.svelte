<script>
	import Home from './Home/Home.svelte';
	import Layout from './UI/Layout.svelte';
	import Components from './Components/index.svelte';

	import AlertsPage from './Components/AlertsPage.svelte';
	import BadgePage from './Components/BadgePage.svelte';
	import BreadcrumbsPage from './Components/BreadcrumbsPage';

	let mainPage;
	let subPage;
	setCurrentPage();

	function handleHashChange(e) {
		setCurrentPage();
	}

	function getCurrentPage() {
		return window.location.hash.substring(1).split('/');
	}

	function setCurrentPage() {
		const currentPage = getCurrentPage();
		mainPage = currentPage[0] || 'Home';
		subPage = currentPage.length > 1 ? currentPage[1] : null;
		if (mainPage === 'components' && !subPage) {
			window.location.hash = '#components/alerts';
		}
	}
</script>

<svelte:window on:hashchange="{handleHashChange}" />
<Layout segment="{mainPage}">
	{#if mainPage === 'Home'}
		<Home />
	{:else if mainPage === 'components'}
		<Components selected="{subPage}">
		{#if subPage === 'alerts'}
			<AlertsPage />
		{:else if subPage === 'badge'}
			<BadgePage />
		{:else if subPage === 'breadcrumbs'}
			<BreadcrumbsPage />
		{:else}
			<div>{subPage} not found</div>
		{/if}
		</Components>
	{:else if mainPage === 'utilities'}
		<div>Utilities</div>
	{:else}
		<div>Unknown page {mainPage}</div>
	{/if}
</Layout>
