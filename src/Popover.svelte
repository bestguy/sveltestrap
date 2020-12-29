<script>
  // TODO: STORYBOOK
  // TODO: UNIT TEST

  import { onMount } from 'svelte';
  import { createPopper } from '@popperjs/core';
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let children = undefined;
  export let animation = true;
  export let placement = 'top';
  export let target = '';
  export let title = '';
  let isPopoverShow = false;
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

  const onClickTarget = () => {
    isPopoverShow = !isPopoverShow;
    if (isPopoverShow) {
      popperInstance.update();
    }
  };

  onMount(() => {
    targetEl = document.querySelector(`#${target}`);
    targetEl.addEventListener('click', onClickTarget);
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
  });

  $: if (!target) {
    throw new Error("Need target!");
  }

  $: classes = classnames(
    className,
    'popover',
    animation ? 'fade' : false,
    `bs-popover-${popperPlacement}`,
    isPopoverShow ? 'show' : false
  );
</script>

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
