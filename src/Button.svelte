<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let active = false;
  export let block = false;
  export let children = undefined;
  export let close = false;
  export let color = 'secondary';
  export let disabled = false;
  export let href = '';
  export let id = '';
  export let outline = false;
  export let size = '';
  export let style = '';
  export let value = '';


  $: ariaLabel = $$props['aria-label'];

  $: classes = classnames(
    className,
    { close },
    close || 'btn',
    close || `btn${outline ? '-outline' : ''}-${color}`,
    size ? `btn-${size}` : false,
    block ? 'btn-block' : false,
    { active }
  );

  $: defaultAriaLabel = close ? 'Close' : null;
</script>

{#if href}
  <a
    {...$$restProps}
    {id}
    class={classes}
    {disabled}
    on:click
    {href}
    aria-label={ariaLabel || defaultAriaLabel}
    {style}>
    {#if children}
      {children}
    {:else}
      <slot />
    {/if}
  </a>
{:else}
  <button
    {...$$restProps}
    {id}
    class={classes}
    {disabled}
    on:click
    {value}
    aria-label={ariaLabel || defaultAriaLabel}
    {style}>
    <slot>
      {#if close}
        <span aria-hidden="true">×</span>
      {:else if children}
        {children}
      {:else}
        <slot />
      {/if}
    </slot>
  </button>
{/if}
