<script>
  // TODO: STORYBOOK
  // TODO: UNIT TEST
  // TODO: TYPES
  // TODO: CHECK POSITION FOR POPPER
  // TODO: THROW ERROR FOR TARGET IS MISSING

  import { onMount } from 'svelte';
  import { createPopper } from '@popperjs/core';
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let animation = true;
  export let placement = 'top';
  export let target = '';
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
            offset: ({ placement, popper, reference }) => {
              if (placement === 'bottom') {
                return [0, popper.width / 2];
              } else if (placement === 'top') {
                return [0, popper.width / 2];
              } else if (placement === 'right') {
                return [0, 0];
              }
              return [popper.height / 2, 0];
            }
          }
        }
      ]
    });
  });

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
  <h3 class="popover-header">TITLE</h3>
  <div class="popover-body">
    <slot />
  </div>
</div>
