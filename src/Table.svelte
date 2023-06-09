<script>
  import classnames from './utils';
  import Colgroup from './Colgroup.svelte';
  import ResponsiveContainer from './ResponsiveContainer.svelte';
  import TableFooter from './TableFooter.svelte';
  import TableHeader from './TableHeader.svelte';

  let className = '';
  export { className as class };
  export let size = '';
  export let bordered = false;
  export let borderless = false;
  export let striped = false;
  export let hover = false;
  export let responsive = false;
  export let rows = undefined;

  $: classes = classnames(
    className,
    'table',
    size ? 'table-' + size : false,
    bordered ? 'table-bordered' : false,
    borderless ? 'table-borderless' : false,
    striped ? 'table-striped' : false,
    hover ? 'table-hover' : false
  );
</script>

<ResponsiveContainer {responsive}>
  <table {...$$restProps} class={classes}>
    {#if rows}
      <Colgroup>
        <slot />
      </Colgroup>
      <TableHeader>
        <slot />
      </TableHeader>
      <tbody>
        {#each rows as row}
          <tr>
            <slot {row} />
          </tr>
        {/each}
      </tbody>
      <TableFooter>
        <slot />
      </TableFooter>
    {:else}
      <slot />
    {/if}
  </table>
</ResponsiveContainer>
