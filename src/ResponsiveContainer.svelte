<script lang="ts">
  import classnames from './utils.ts';

  let className = '';
  export { className as class };
  export let responsive: boolean | string = false;

  $: responsiveClassName = classnames(className, {
    'table-responsive': responsive === true,
    [`table-responsive-${responsive}`]: typeof responsive === 'string'
  });
</script>

{#if responsive}
  <div class={responsiveClassName}><slot /></div>
{:else}
  <slot />
{/if}
