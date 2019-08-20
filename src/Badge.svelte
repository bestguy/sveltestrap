<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let children;
  export let color = 'secondary';
  export let href = undefined;
  export let pill = false;

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'badge',
    `badge-${color}`,
    pill ? 'badge-pill' : false
  );
</script>

{#if href}
<a {...props} {href} class="{classes}">
  {#if children}
    {children}
  {:else}
    <slot />
  {/if}
</a>
{:else}
<span {...props} class="{classes}">
  {#if children}
    {children}
  {:else}
    <slot />
  {/if}
</span>
{/if}
