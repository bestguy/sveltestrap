<script>
  import { onMount } from 'svelte';
  import { createPopper } from '@popperjs/core';
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let target = '';
  export let placement = 'top';
  export let children = undefined;
  export let animation = true;
  export let isOpen = false;
  let popperInstance;
  let popperPlacement = placement;
  let tooltipEl;
  let targetEl;

  const checkPopperPlacement = {
    name: 'checkPopperPlacement',
    enabled: true,
    phase: 'main',
    fn({ state }) {
      popperPlacement = state.placement;
    }
  };

  $: {
    if (isOpen && tooltipEl) {
      popperInstance = createPopper(targetEl, tooltipEl, {
        placement,
        modifiers: [checkPopperPlacement]
      });
    } else if (popperInstance) {
      popperInstance.destroy();
      popperInstance = undefined;
    }
  }

  onMount(() => {
    targetEl = document.querySelector(`#${target}`);
    targetEl.addEventListener('mouseover', () => isOpen = true);
    targetEl.addEventListener('mouseleave', () => isOpen = false);
  });

  $: classes = classnames(
    className,
    'tooltip',
    animation ? 'fade' : false,
    `bs-tooltip-${popperPlacement}`,
    isOpen ? 'show' : false
  );

  $: if (!target) {
    throw new Error('Need target!');
  }
</script>

{#if isOpen}
  <div
    bind:this={tooltipEl}
    {...$$restProps}
    class={classes}
    role="tooltip"
    x-placement={popperPlacement}>
    <div class="arrow" data-popper-arrow />
    <div class="tooltip-inner">
      {#if children}
        {children}
      {:else}
        <slot />
      {/if}
    </div>
  </div>
{/if}
