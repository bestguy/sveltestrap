<script lang="ts">
  import classnames from './utils';
  type ButtonColor =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';

  type ButtonSize = 'lg' | 'sm';

  let className = '';
  export { className as class };
  export let active: boolean = false;
  export let block: boolean = false;
  export let children = undefined;
  export let close: boolean = false;
  export let color: ButtonColor = 'secondary';
  export let disabled: boolean = false;
  export let href: string = '';
  export let id: string = '';
  export let outline: boolean = false;
  export let size: ButtonSize;
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
