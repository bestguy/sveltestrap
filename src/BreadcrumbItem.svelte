<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let active = false;
  export let children;

  $: classes = clsx(
    className,
    active ? 'active' : false,
    'breadcrumb-item'
  );
</script>

<li class="{classes}" aria-current="{active ? 'page' : undefined}">
  {#if children}
    {children}
  {:else}
    <slot />
  {/if}
</li>
