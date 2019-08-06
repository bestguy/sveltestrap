<script>
	import { Breadcrumb, BreadcrumbItem } from 'sveltestrap';
</script>

<Breadcrumb tag="nav" listTag="div">
	<BreadcrumbItem tag="a" href="#">Home</BreadcrumbItem>
	<BreadcrumbItem tag="a" href="#">Library</BreadcrumbItem>
	<BreadcrumbItem tag="a" href="#">Data</BreadcrumbItem>
	<BreadcrumbItem active tag="span">Bootstrap</BreadcrumbItem>
</Breadcrumb>
