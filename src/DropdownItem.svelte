<script>
  import { getContext } from 'svelte';
  import classnames from './utils';

  const context = getContext('dropdownContext');

  let className = '';
  export { className as class };

  export let active = false;
  export let disabled = false;
  export let divider = false;
  export let header = false;
  export let toggle = true;
  export let href = '';

  $: classes = classnames(className, {
    disabled,
    'dropdown-item': !divider && !header,
    active: active,
    'dropdown-header': header,
    'dropdown-divider': divider
  });

  function handleItemClick(e) {
    if (disabled || header || divider) {
      e.preventDefault();
      return;
    }

    if (
      toggle &&
      ($context.autoClose === true || $context.autoClose === 'outside')
    ) {
      $context.toggle(e);
    }
  }
</script>

<li>
{#if header}
  <h6 {...$$restProps} on:click on:click={handleItemClick} class={classes}>
    <slot />
  </h6>
{:else if divider}
  <div {...$$restProps} on:click on:click={handleItemClick} class={classes}>
    <slot />
  </div>
{:else if href}
  <a {...$$restProps} click on:click={handleItemClick} {href} class={classes}>
    <slot />
  </a>
{:else}
  <button
    type="button"
    {...$$restProps}
    on:click
    on:click={handleItemClick}
    class={classes}
  >
    <slot />
  </button>
{/if}
</li>