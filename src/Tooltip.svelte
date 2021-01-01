<script>
  import { onMount, tick } from 'svelte';
  import { createPopper } from '@popperjs/core';
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let target = '';
  export let placement = 'top';
  export let children = undefined;
  export let animation = true;
  export let debugHover = false;
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

  const enableHover = async () => {
    isHover = true;
    await tick();
    popperInstance = createPopper(targetEl, tooltipEl, {
      placement,
      modifiers: [checkPopperPlacement]
    });
  };

  const disableHover = () => {
    isHover = false;
    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = undefined;
    }
  };

  onMount(() => {
    targetEl = document.querySelector(`#${target}`);
    targetEl.addEventListener('mouseover', enableHover);
    targetEl.addEventListener('mouseleave', disableHover);
  });

  $: classes = classnames(
    className,
    'tooltip',
    animation ? 'fade' : false,
    `bs-tooltip-${popperPlacement}`,
    isHover ? 'show' : false
  );

  $: if (!target) {
    throw new Error('Need target!');
  }
</script>

{#if isHover || debugHover}
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
