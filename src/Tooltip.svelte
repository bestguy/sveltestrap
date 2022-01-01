<script>
  import { onDestroy, onMount } from 'svelte';
  import { createPopper } from '@popperjs/core/dist/esm/popper';
  import classnames, { uuid } from './utils';
  import InlineContainer from './InlineContainer.svelte';
  import Portal from './Portal.svelte';

  let className = '';
  export { className as class };
  export let animation = true;
  export let children = undefined;
  export let container = undefined;
  export let id = `tooltip_${uuid()}`;
  export let isOpen = false;
  export let placement = 'top';
  export let target = '';
  let bsPlacement;
  let popperInstance;
  let popperPlacement = placement;
  let targetEl;
  let tooltipEl;

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

  const open = () => (isOpen = true);
  const close = () => (isOpen = false);
  
  onMount(registerEventListeners);
  onDestroy(unregisterEventListeners);

  $: if (target) {
    unregisterEventListeners();
    registerEventListeners();
  }

  function registerEventListeners() {

    if (target == null || target.length == 0) {
      targetEl = null;
    }
    else if (target instanceof HTMLElement) {
      targetEl = target;
    }
    else {
      targetEl = document.querySelector(`#${target}`);
    } 

    if (targetEl) {
      targetEl.addEventListener('mouseover', open);
      targetEl.addEventListener('mouseleave', close);
      targetEl.addEventListener('focus', open);
      targetEl.addEventListener('blur', close);
    }
  }

  function unregisterEventListeners() { 
    if (targetEl) {
      targetEl.removeEventListener('mouseover', open);
      targetEl.removeEventListener('mouseleave', close);
      targetEl.removeEventListener('focus', open);
      targetEl.removeEventListener('blur', close);
      targetEl.removeAttribute('aria-describedby');
    }
  }

  $: if (targetEl) {
    if (isOpen) targetEl.setAttribute('aria-describedby', id);
    else targetEl.removeAttribute('aria-describedby');
  }

  $: {
    if (popperPlacement === 'left') bsPlacement = 'start';
    else if (popperPlacement === 'right') bsPlacement = 'end';
    else bsPlacement = popperPlacement;
  }

  $: classes = classnames(
    className,
    'tooltip',
    animation ? 'fade' : false,
    `bs-tooltip-${bsPlacement}`,
    isOpen ? 'show' : false
  );

  $: outer = container === 'inline' ? InlineContainer : Portal;
</script>

{#if isOpen}
  <svelte:component this={outer}>
    <div
      bind:this={tooltipEl}
      {...$$restProps}
      class={classes}
      {id}
      role="tooltip"
      x-placement={popperPlacement}
    >
      <div class="tooltip-arrow" data-popper-arrow />
      <div class="tooltip-inner">
        {#if children}
          {children}
        {:else}
          <slot />
        {/if}
      </div>
    </div>
  </svelte:component>
{/if}
