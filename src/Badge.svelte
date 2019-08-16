<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let children;
  export let color = 'secondary';
  export let href = undefined;
  export let pill = false;

  $: classes = clsx(
    className,
    'badge',
    `badge-${color}`,
    pill ? 'badge-pill' : false
  );
</script>

{#if href}
<a {href} class="{classes}">
  {#if children}
    {children}
  {:else}
    <slot />
  {/if}
</a>
{:else}
<span class="{classes}">
  {#if children}
    {children}
  {:else}
    <slot />
  {/if}
</span>
{/if}
