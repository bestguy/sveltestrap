<script>
  import { onMount } from 'svelte';
  import { createPopper } from '@popperjs/core';
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let target = '';
  export let placement = 'top';
  export let children = undefined;
  let animation = true;
  let isHover = false;
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

  const enableHover = () => {
    isHover = true;
    if (popperInstance) {
      popperInstance.update();
    }
  };

  const disableHover = () => {
    isHover = false;
  };

  onMount(() => {
    targetEl = document.querySelector(`#${target}`);
    targetEl.addEventListener('mouseover', enableHover);
    targetEl.addEventListener('mouseleave', disableHover);
    popperInstance = createPopper(targetEl, tooltipEl, {
      placement,
      modifiers: [checkPopperPlacement]
    });
  });

  $: classes = classnames(
    className,
    'tooltip',
    animation ? 'fade' : false,
    `bs-tooltip-${popperPlacement}`,
    isHover ? 'show' : false
  );
</script>

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
