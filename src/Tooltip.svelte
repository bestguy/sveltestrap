<script>
  import { onMount } from 'svelte';
  import { createPopper } from '@popperjs/core';
  import classnames, { generateRandomDigits } from './utils';

  let className = '';
  export { className as class };
  export let target = '';
  export let placement = 'top';
  export let children = undefined;
  let isHover = false;
  let popperPlacement = '';

  const tooltipId = `tooltip${generateRandomDigits(0, 100000)}`;

  const enableHover = () => {
    isHover = true;
  };

  const disableHover = () => {
    isHover = false;
  };

  const checkPopperPlacement = {
    name: 'checkPopperPlacement',
    enabled: true,
    phase: 'main',
    fn({ state }) {
      if (state.placement === 'top') {
        popperPlacement = 'top';
      } else if (state.placement === 'bottom') {
        popperPlacement = 'bottom';
      } else if (state.placement === 'right') {
        popperPlacement = 'right'
      } else {
        popperPlacement = 'left';
      }
    }
  };

  onMount(() => {
    const tooltip = document.querySelector(`#${tooltipId}`);
    const targetEl = document.querySelector(`#${target}`);
    targetEl.addEventListener('mouseover', enableHover);
    targetEl.addEventListener('mouseleave', disableHover);

    createPopper(targetEl, tooltip, {
      placement,
      modifiers: [checkPopperPlacement]
    });
  });

  $: ariaLabel = $$props['aria-label'];

  $: classes = classnames(
    className,
    'tooltip',
    'fade',
    `bs-tooltip-${popperPlacement || placement}`,
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
