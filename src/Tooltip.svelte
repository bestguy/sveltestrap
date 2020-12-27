<script>
  import { onDestroy, onMount, tick } from 'svelte';
  import { createPopper } from '@popperjs/core';
  import classnames, { generateRandomDigits } from './utils';

  let className = '';
  export { className as class };
  export let target = '';
  export let placement = 'top';
  export let children = undefined;
  let isHover = false;
  let popperInstance;
  let popperPlacement = placement;
  let tooltipEl;
  let targetEl;

  const tooltipId = `tooltip${generateRandomDigits(0, 100000)}`;

  const checkPopperPlacement = {
    name: 'checkPopperPlacement',
    enabled: true,
    phase: 'main',
    fn({ state }) {
      popperPlacement = state.placement;
    }
  };

  const enableHover = () => {
    isHover = true;
    if (popperInstance) {
      popperInstance.update();
    }
  };

  const disableHover = () => {
    isHover = false;
    if (popperInstance) {
      popperInstance.destory();
    }
  };

  onMount(() => {
    tooltipEl = document.querySelector(`#${tooltipId}`);
    targetEl = document.querySelector(`#${target}`);
    targetEl.addEventListener('mouseover', enableHover);
    targetEl.addEventListener('mouseleave', disableHover);
    popperInstance = createPopper(targetEl, tooltipEl, {
      placement,
      modifiers: [checkPopperPlacement]
    });
  });

  $: ariaLabel = $$props['aria-label'];

  $: classes = classnames(
    className,
    'tooltip',
    'fade',
    `bs-tooltip-${popperPlacement}`,
    isHover ? 'show' : false
  );
</script>

<div
  id={tooltipId}
  class={classes}
  role="tooltip"
  x-placement={popperPlacement}
  aria-label={ariaLabel}>
  <div class="arrow" data-popper-arrow />
  <div class="tooltip-inner">
    {#if children}
      {children}
    {:else}
      <slot />
    {/if}
  </div>
</div>
