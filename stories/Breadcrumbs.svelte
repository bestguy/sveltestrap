<script>
  import Breadcrumb from "../src/Breadcrumb.svelte";
  import BreadcrumbItem from "../src/BreadcrumbItem.svelte";
</script>

<h1>Breadcrumb</h1>
<a
  href="https://getbootstrap.com/docs/4.3/components/breadcrumb/"
  target="_blank">
  Bootstrap Breadcrumb
</a>

<Breadcrumb>
  <BreadcrumbItem active>Home</BreadcrumbItem>
</Breadcrumb>
<Breadcrumb>
  <BreadcrumbItem>
    <a href="#">Home</a>
  </BreadcrumbItem>
  <BreadcrumbItem active>Library</BreadcrumbItem>
</Breadcrumb>
<Breadcrumb>
  <BreadcrumbItem>
    <a href="#">Home</a>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <a href="#">Library</a>
  </BreadcrumbItem>
  <BreadcrumbItem active>Data</BreadcrumbItem>
</Breadcrumb>
