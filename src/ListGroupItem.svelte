<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let active = false;
  export let disabled = false;
  export let color = '';
  export let action = false;
  export let href = null;
  export let tag = null;

  $: classes = classnames(className, 'list-group-item', {
    active,
    disabled,
    'list-group-item-action': action || tag === 'button',
    [`list-group-item-${color}`]: color
  });
</script>

{#if href}
  <a {...$$restProps} class={classes} on:click {href} {disabled} {active}>
    <slot />
  </a>
{:else if tag === 'button'}
  <button
    {...$$restProps}
    class={classes}
    type="button"
    on:click
    {disabled}
    {active}
  >
    <slot />
  </button>
{:else}
  <li {...$$restProps} class={classes} on:click {disabled} {active}>
    <slot />
  </li>
{/if}
