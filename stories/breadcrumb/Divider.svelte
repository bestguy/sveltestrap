<script lang="ts">
  import { Breadcrumb, BreadcrumbItem } from 'sveltestrap';
</script>

<Breadcrumb divider="・">
  <BreadcrumbItem>
    <a href="#home">Home</a>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <a href="#library">Library</a>
  </BreadcrumbItem>
  <BreadcrumbItem active>Data</BreadcrumbItem>
</Breadcrumb>

<hr />

<Breadcrumb divider="⟫">
  <BreadcrumbItem>
    <a href="#home">Home</a>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <a href="#library">Library</a>
  </BreadcrumbItem>
  <BreadcrumbItem active>Data</BreadcrumbItem>
</Breadcrumb>
