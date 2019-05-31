<script>
	import { Breadcrumb, BreadcrumbItem } from 'sveltestrap';
</script>

<Breadcrumb>
	<BreadcrumbItem active>Home</BreadcrumbItem>
</Breadcrumb>
<Breadcrumb>
	<BreadcrumbItem><a href="#components/breadcrumbs">Home</a></BreadcrumbItem>
	<BreadcrumbItem active>Library</BreadcrumbItem>
</Breadcrumb>
<Breadcrumb>
	<BreadcrumbItem><a href="#components/breadcrumbs">Home</a></BreadcrumbItem>
	<BreadcrumbItem><a href="#components/breadcrumbs">Library</a></BreadcrumbItem>
	<BreadcrumbItem active>Data</BreadcrumbItem>
</Breadcrumb>
