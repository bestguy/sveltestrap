<script lang="typescript">
  import { getContext } from 'svelte';
  import classnames from './utils';

  import Button from './Button.svelte';

  const context = getContext('dropdownContext');

  let className = '';
  export { className as class };
  export let caret = false;
  export let color = 'secondary';
  export let disabled = false;
  export let ariaHaspopup = true;
  export let ariaLabel = 'Toggle Dropdown';
  export let split = false;
  export let nav = false;
  export let size = '';
  export let tag = null;
  export let outline = false;

  $: classes = classnames(className, {
    'dropdown-toggle': caret || split,
    'dropdown-toggle-split': split,
    'nav-link': nav
  });

  function toggleButton(e) {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (nav) {
      e.preventDefault();
    }

    $context.toggle(e);
  }
</script>

{#if nav}
  <a
    {...$$restProps}
    on:click
    on:click={toggleButton}
    href="#nav"
    {ariaHaspopup}
    class={classes}>
    <slot>
      <span class="sr-only">{ariaLabel}</span>
    </slot>
  </a>
{:else if tag === 'span'}
  <span
    {...$$restProps}
    on:click
    on:click={toggleButton}
    {ariaHaspopup}
    class={classes}
    {color}
    {size}>
    <slot>
      <span class="sr-only">{ariaLabel}</span>
    </slot>
  </span>
{:else}
  <Button
    {...$$restProps}
    on:click
    on:click={toggleButton}
    {ariaHaspopup}
    class={classes}
    {color}
    {size}
    {outline}>
    <slot>
      <span class="sr-only">{ariaLabel}</span>
    </slot>
  </Button>
{/if}
