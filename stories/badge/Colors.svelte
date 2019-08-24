<script>
  import { Badge } from "sveltestrap";

  const colors = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark"
  ];
</script>

{#each colors as color}
  <div>
    <Badge {color}>
      {color}
    </Badge>
  </div>
{/each}
