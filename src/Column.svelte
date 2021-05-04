<script>
  import { getContext } from 'svelte';

  export let footer = undefined;
  export let header = undefined;
  export let width = undefined;

  const colgroup = getContext('colgroup');
  const head = getContext('header');
  const foot = getContext('footer');
</script>

{#if colgroup}
  <col style="width: {width};" />
{:else if foot}
  <th {...$$restProps}>
    {#if footer}{footer}{/if}
    <slot name="footer" />
  </th>
{:else if head}
  <th {...$$restProps}>
    {#if header}{header}{/if}
    <slot name="header" />
  </th>
{:else}
  <td {...$$restProps}>
    <slot />
  </td>
{/if}
