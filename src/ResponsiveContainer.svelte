<script>
  import classnames from './utils';

  let className = '';
  export let responsive = false;

  $: responsiveClassName = classnames(className, {
    'table-responsive': responsive === true,
    [`table-responsive-${responsive}`]: responsive
  });
</script>

{#if responsive}
  <div class={responsiveClassName}><slot /></div>
{:else}
  <slot />
{/if}