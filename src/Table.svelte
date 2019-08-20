<script>
  import clsx from 'clsx';
  import toNumber from 'lodash.tonumber';

  let className = '';
  export {className as class};
  export let size = '';
  export let bordered = false;
  export let borderless = false;
  export let striped = false;
  export let dark = false;
  export let hover = false;
  export let responsive = false;

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'table',
    size ? 'table-' + size : false,
    bordered ? 'table-bordered' : false,
    borderless ? 'table-borderless' : false,
    striped ? 'table-striped' : false,
    dark ? 'table-dark' : false,
    hover ? 'table-hover' : false,
  );

  $: responsiveClassName = responsive === true ? 'table-responsive' : `table-responsive-${responsive}`;
</script>

{#if responsive}
  <div class="{responsiveClassName}">
    <table {...props} class="{classes}">
      <slot />
    </table>
  </div>
{:else}
  <table {...props} class="{classes}">
    <slot />
  </table>
{/if}

