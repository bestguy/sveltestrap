<script>
  import { getContext } from 'svelte';
  import classnames from './utils';

  const context = getContext('dropdownContext');

  let className = '';
  export { className as class };
  export let ariaLabel = 'Toggle Dropdown';
  export let active = false;
  export let block = false;
  export let caret = false;
  export let color = 'secondary';
  export let disabled = false;
  export let inner = undefined;
  export let nav = false;
  export let outline = false;
  export let size = '';
  export let split = false;
  export let tag = null;

  $: classes = classnames(className, {
    'dropdown-toggle': caret || split,
    'dropdown-toggle-split': split,
    'nav-link': nav,
    show: $context.isOpen
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

  $: btnClasses = classnames(
    classes,
    'btn',
    `btn${outline ? '-outline' : ''}-${color}`,
    size ? `btn-${size}` : false,
    block ? 'd-block w-100' : false,
    { active }
  );
</script>

{#if nav}
  <a
    use:$context.popperRef
    {...$$restProps}
    bind:this={inner}
    on:click
    on:click={toggleButton}
    href="#nav"
    aria-expanded={$context.isOpen}
    class={classes}
  >
    <slot>
      <span class="visually-hidden">{ariaLabel}</span>
    </slot>
  </a>
{:else if tag === 'div'}
  <div
    use:$context.popperRef
    {...$$restProps}
    bind:this={inner}
    on:click
    on:click={toggleButton}
    aria-expanded={$context.isOpen}
    class={classes}
  >
    <slot>
      <span class="visually-hidden">{ariaLabel}</span>
    </slot>
  </div>
{:else if tag === 'span'}
  <span
    use:$context.popperRef
    {...$$restProps}
    bind:this={inner}
    on:click
    on:click={toggleButton}
    aria-expanded={$context.isOpen}
    class={classes}
  >
    <slot>
      <span class="visually-hidden">{ariaLabel}</span>
    </slot>
  </span>
{:else}
  <button
    use:$context.popperRef
    {...$$restProps}
    bind:this={inner}
    type="button"
    on:click
    on:click={toggleButton}
    aria-expanded={$context.isOpen}
    class={btnClasses}
  >
    <slot>
      <span class="visually-hidden">{ariaLabel}</span>
    </slot>
  </button>
{/if}
