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
  export let outline = false;
  export let size = null;
  export let style = '';
  export let value = '';
  // for tooltip
  export let title = '';
  export let isHover = false;

  $: dataToggle = $$props['data-toggle'] === 'tooltip' ? 'tooltip' : '';

  $: dataPlacement = $$props['data-placement'];

  $: ariaLabel = $$props['aria-label'];

  $: classes = classnames(
    className,
    { close },
    close || 'btn',
    close || `btn${outline ? '-outline' : ''}-${color}`,
    size ? `btn-${size}` : false,
    block ? 'btn-block' : false,
    { active },
  );

  $: defaultAriaLabel = close ? 'Close' : null;

  $: tooltipClasses = classnames(
    className,
    'tooltip',
    'fade',
    dataPlacement ? `bs-tooltip-${dataPlacement}` : 'bs-tooltip-top',
    isHover ? 'show' : false,
  )

  const onMouseOver = () => {
    isHover = true;
  }

  const onMouseOut = () => {
    isHover = false;
  }

</script>

<h1>{dataToggle}</h1>
<h1>{dataPlacement}</h1>



{#if href}
  <a
    {...$$restProps}
    class={classes}
    {disabled}
    on:click
    on:mouseover={onMouseOver}
    on:mouseout={onMouseOut}
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
    class={classes}
    {disabled}
    on:click
    on:mouseover={onMouseOver}
    on:mouseout={onMouseOut}
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

{#if dataToggle}
  <div class={tooltipClasses} role="tooltip" x-placement="top">
    <div class="arrow"></div>
    <div class="tooltip-inner">{title}</div>
  </div>
{/if}
