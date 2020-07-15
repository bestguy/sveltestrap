<script>
  import { fade as fadeTransition } from 'svelte/transition';
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let children = undefined;
  export let color = 'success';
  export let closeClassName = '';
  export let closeAriaLabel = 'Close';
  export let isOpen = true;
  export let toggle = undefined;
  export let fade = true;
  export let transition = { duration: fade ? 400 : 0 };


  $: classes = clsx(className, 'alert', `alert-${color}`, {
    'alert-dismissible': toggle
  });
  $: closeClassNames = clsx('close', closeClassName);
</script>

{#if isOpen}
  <div
    {...$$restProps}
    transition:fadeTransition={transition}
    class={classes}
    role="alert">
    {#if toggle}
      <button
        type="button"
        class={closeClassNames}
        aria-label={closeAriaLabel}
        on:click={toggle}>
        <span aria-hidden="true">×</span>
      </button>
    {/if}
    {#if children}
      {children}
    {:else}
      <slot />
    {/if}
  </div>
{/if}
