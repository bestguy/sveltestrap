<script>
  import { fade as fadeTransition } from 'svelte/transition';
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let children = undefined;
  export let color = 'success';
  export let closeClassName = '';
  export let closeAriaLabel = 'Close';
  export let dismissible = false;
  export let isOpen = true;
  export let toggle = undefined;
  export let fade = true;
  export let transition = { duration: fade ? 400 : 0 };

  $: showClose = dismissible || toggle;
  $: handleToggle = toggle || (() => (isOpen = false));
  $: classes = classnames(className, 'alert', `alert-${color}`, {
    'alert-dismissible': showClose
  });
  $: closeClassNames = classnames('btn-close', closeClassName);
</script>

{#if isOpen}
  <div
    {...$$restProps}
    transition:fadeTransition={transition}
    class={classes}
    role="alert">
    {#if showClose}
      <button
        type="button"
        class={closeClassNames}
        aria-label={closeAriaLabel}
        on:click={handleToggle} />
    {/if}
    {#if children}
      {children}
    {:else}
      <slot />
    {/if}
  </div>
{/if}
