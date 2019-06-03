<script>
	import Home from './Home/Home.svelte';
	import Layout from './UI/Layout.svelte';
	import Components from './Components/index.svelte';

	import AlertsPage from './Components/AlertsPage.svelte';
	import BadgePage from './Components/BadgePage.svelte';
	import BreadcrumbsPage from './Components/BreadcrumbsPage';
	import ButtonDropdownPage from './Components/ButtonDropdownPage.svelte';
	import ButtonGroupPage from './Components/ButtonGroupPage.svelte';
	import ButtonsPage from './Components/ButtonsPage.svelte';
	import CardPage from './Components/CardPage.svelte'
	import CarouselPage from './Components/CarouselPage.svelte';
	import CollapsePage from './Components/CollapsePage.svelte';
	import DropdownsPage from './Components/DropdownsPage.svelte';
	import FadePage from './Components/FadePage.svelte';
	import FormPage from './Components/FormPage.svelte';
	import InputGroupPage from './Components/InputGroupPage.svelte';
	import JumbotronPage from './Components/JumbotronPage.svelte';
	import LayoutPage from './Components/LayoutPage.svelte';
	import ListGroupPage from './Components/ListGroupPage.svelte';
	import MediaPage from './Components/MediaPage.svelte';
	import ModalsPage from './Components/ModalsPage.svelte';
	import NavbarPage from './Components/NavbarPage.svelte';
	import NavsPage from './Components/NavsPage.svelte';
	import PaginationPage from './Components/PaginationPage.svelte';
	import PopoversPage from './Components/PopoversPage.svelte';
	import ProgressPage from './Components/ProgressPage.svelte';
	import SpinnersPage from './Components/SpinnersPage.svelte';
	import TablesPage from './Components/TablesPage.svelte';
	import TabsPage from './Components/TabsPage.svelte';
	import ToastsPage from './Components/ToastsPage.svelte';
	import TooltipsPage from './Components/TooltipsPage.svelte';

	let mainPage;
	let subPage;
	let windowScrollPostion;
	setCurrentPage();

	function handleHashChange(e) {
		setCurrentPage();
	}

	function getCurrentPage() {
		return window.location.hash.substring(1).split('/');
	}

	function setCurrentPage() {
		const currentPage = getCurrentPage();
		const oldMainPage = mainPage;
		const oldSubPage = subPage;
		mainPage = currentPage[0] || 'Home';
		subPage = currentPage.length > 1 ? currentPage[1] : null;
		if (mainPage === 'components' && !subPage) {
			window.location.hash = '#components/alerts';
		}

		if (mainPage !== oldMainPage || subPage !== oldSubPage) {
			windowScrollPostion = 0;
		}
	}
</script>

<svelte:window on:hashchange="{handleHashChange}" bind:scrollY="{windowScrollPostion}" />
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
		{:else if subPage === 'button-dropdown'}
			<ButtonDropdownPage />
		{:else if subPage === 'button-group'}
			<ButtonGroupPage />
		{:else if subPage === 'buttons'}
			<ButtonsPage />
		{:else if subPage === 'card'}
			<CardPage />
		{:else if subPage === 'carousel'}
			<CarouselPage />
		{:else if subPage === 'collapse'}
			<CollapsePage />
		{:else if subPage === 'dropdowns'}
			<DropdownsPage />
		{:else if subPage === 'fade'}
			<FadePage />
		{:else if subPage === 'form'}
			<FormPage />
		{:else if subPage === 'input-group'}
			<InputGroupPage />
		{:else if subPage === 'jumbotron'}
			<JumbotronPage />
		{:else if subPage === 'layout'}
			<LayoutPage />
		{:else if subPage === 'list-group'}
			<ListGroupPage />
		{:else if subPage === 'media'}
			<MediaPage />
		{:else if subPage === 'modals'}
			<ModalsPage />
		{:else if subPage === 'navbar'}
			<NavbarPage />
		{:else if subPage === 'navs'}
			<NavsPage />
		{:else if subPage === 'pagination'}
			<PaginationPage />
		{:else if subPage === 'popovers'}
			<PopoversPage />
		{:else if subPage === 'progress'}
			<ProgressPage />
		{:else if subPage === 'spinners'}
			<SpinnersPage />
		{:else if subPage === 'tables'}
			<TablesPage />
		{:else if subPage === 'tabs'}
			<TabsPage />
		{:else if subPage === 'toasts'}
			<ToastsPage />
		{:else if subPage === 'tooltips'}
			<TooltipsPage />
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
