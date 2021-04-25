<script>
  import { onMount } from 'svelte';
  import { createPopper } from '@popperjs/core/dist/esm/popper';
  import classnames from './utils';
  import InlineContainer from './InlineContainer.svelte';
  import Portal from './Portal.svelte';

  let className = '';
  export { className as class };
  export let animation = true;
  export let children = undefined;
  export let container;
  export let dismissible = false;
  export let isOpen = false;
  export let placement = 'top';
  export let target = '';
  export let title = '';
  export let trigger = 'click';
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
  }

  const open = () => isOpen = true;
  const close = () => isOpen = false;
  const toggle = () => isOpen = !isOpen;

  onMount(() => {
    targetEl = document.querySelector(`#${target}`);
    switch (trigger) {
      case 'hover':
        targetEl.addEventListener('mouseover', open);
        targetEl.addEventListener('mouseleave', close);
        break;
      case 'focus':
        targetEl.addEventListener('focus', open);
        targetEl.addEventListener('blur', close);
        break;
      default:
        targetEl.addEventListener('click', toggle);
        if (dismissible) targetEl.addEventListener('blur', close);
        break;
    }
    return () => {
      switch (trigger) {
        case 'hover':
          targetEl.removeEventListener('mouseover', open);
          targetEl.removeEventListener('mouseleave', close);
          break;
        case 'focus':
          targetEl.removeEventListener('focus', open);
          targetEl.removeEventListener('blur', close);
          break;
        default:
          targetEl.removeEventListener('click', toggle);
          if (dismissible) targetEl.removeEventListener('blur', close);
          break;
      }
    };
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

  $: outer = container === 'inline' ? InlineContainer : Portal;
</script>

{#if isOpen}
<svelte:component this={outer}>
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
</svelte:component>
{/if}
