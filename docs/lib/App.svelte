<script>
	import { Router, Route } from "svelte-routing";
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
</script>

<svelte:window bind:scrollY="{windowScrollPostion}" />
<Router basepath="/sveltestrap">
	<Layout segment="{mainPage}">
		<Route path="/" component="{Home}" />
		<Route path="/components/*">
			<Components>
				<Router>
					<Route path="/alerts" component="{AlertsPage}" />
					<Route path="/badge" component="{BadgePage}" />
					<Route path="/alert" component="{AlertsPage}" />
					<Route path="/badge" component="{BadgePage}" />
					<Route path="/breadcrumbs" component="{BreadcrumbsPage}" />
					<Route path="/button-dropdown" component="{ButtonDropdownPage}" />
					<Route path="/button-group" component="{ButtonGroupPage}" />
					<Route path="/buttons" component="{ButtonsPage}" />
					<Route path="/card" component="{CardPage}" />
					<Route path="/carousels" component="{CarouselPage}" />
					<Route path="/collapse" component="{CollapsePage}" />
					<Route path="/dropdowns" component="{DropdownsPage}" />
					<Route path="/fade" component="{FadePage}" />
					<Route path="/form" component="{FormPage}" />
					<Route path="/input-group" component="{InputGroupPage}" />
					<Route path="/jumbotron" component="{JumbotronPage}" />
					<Route path="/layout" component="{LayoutPage}" />
					<Route path="/listgroup" component="{ListGroupPage}" />
					<Route path="/media" component="{MediaPage}" />
					<Route path="/modals" component="{ModalsPage}" />
					<Route path="/navbar" component="{NavbarPage}" />
					<Route path="/navs" component="{NavsPage}" />
					<Route path="/pagination" component="{PaginationPage}" />
					<Route path="/popovers" component="{PopoversPage}" />
					<Route path="/progress" component="{ProgressPage}" />
					<Route path="/spinners" component="{SpinnersPage}" />
					<Route path="/tables" component="{TablesPage}" />
					<Route path="/tabs" component="{TabsPage}" />
					<Route path="/toasts" component="{ToastsPage}" />
					<Route path="/tooltips" component="{TooltipsPage}" />
				</Router>
			</Components>
		</Route>
	</Layout>
</Router>
