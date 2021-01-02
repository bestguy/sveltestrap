<script>
  import { onMount, tick } from 'svelte';
  import { createPopper } from '@popperjs/core';
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let children = undefined;
  export let animation = true;
  export let hover = false;
  export let placement = 'top';
  export let target = '';
  export let title = '';
  export let isOpen = false;
  let targetEl;
  let popoverEl;
  let popperInstance;
  let popperPlacement = placement;

  const checkPopperPlacement = {
    name: 'checkPopperPlacement',
    enabled: true,
    phase: 'main',
    fn({ state }) {
      popperPlacement = state.placement;
    }
  };

  $: {
    if (isOpen && popoverEl) {
      popperInstance = createPopper(targetEl, popoverEl, {
        placement,
        modifiers: [
          checkPopperPlacement,
          {
            name: 'offset',
            options: {
              offset: () => {
                return [0, 8];
              }
            }
          }
        ]
      });
    } else if (popperInstance) {
      popperInstance.destroy();
      popperInstance = undefined;
    }
  };

  onMount(() => {
    targetEl = document.querySelector(`#${target}`);
    if (hover) {
      targetEl.addEventListener('mouseover', () => isOpen = true);
      targetEl.addEventListener('mouseleave', () => isOpen = false);
    } else {
      targetEl.addEventListener('click', () => isOpen = !isOpen);
    }
    targetEl.addEventListener('focus', () => isOpen = true);
    targetEl.addEventListener('blur', () => isOpen = false);
  });

  $: if (!target) {
    throw new Error('Need target!');
  }

  $: classes = classnames(
    className,
    'popover',
    animation ? 'fade' : false,
    `bs-popover-${popperPlacement}`,
    isOpen ? 'show' : false
  );
</script>

{#if isOpen}
  <div
    bind:this={popoverEl}
    {...$$restProps}
    class={classes}
    role="tooltip"
    x-placement={popperPlacement}>
    <div class="arrow" data-popper-arrow />
    <h3 class="popover-header">
      <slot name="title">{title}</slot>
    </h3>
    <div class="popover-body">
      {#if children}
        {children}
      {:else}
        <slot />
      {/if}
    </div>
  </div>
{/if}
