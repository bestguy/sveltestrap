<script>
  import classnames from './utils';
  import ResponsiveContainer from './ResponsiveContainer.svelte';

  let className = '';
  export { className as class };
  export let size = '';
  export let bordered = false;
  export let borderless = false;
  export let striped = false;
  export let dark = false;
  export let hover = false;
  export let responsive = false;

  $: classes = classnames(
    className,
    'table',
    size ? 'table-' + size : false,
    bordered ? 'table-bordered' : false,
    borderless ? 'table-borderless' : false,
    striped ? 'table-striped' : false,
    dark ? 'table-dark' : false,
    hover ? 'table-hover' : false
  );
</script>

<ResponsiveContainer {responsive}>
  <table {...$$restProps} class={classes}>
    <slot />
  </table>
</ResponsiveContainer>

