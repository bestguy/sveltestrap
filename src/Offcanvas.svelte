<script>
  import { onMount } from 'svelte';
  import OffcanvasBody from './OffcanvasBody.svelte';
  import OffcanvasHeader from './OffcanvasHeader.svelte';
  import classnames, { browserEvent, getTransitionDuration } from './utils';

  let className = '';
  export { className as class };
  export let placement = 'start';
  export let isOpen = false;
  export let scroll = false;
  export let toggle = undefined;
  export let header = undefined;
  export let backdrop = true;

  // TODO support these like Modals:
  // export let autoFocus = true;
  // export let unmountOnClose = true;
  // TODO focus trap

  let body;
  let isTransitioning = false;
  let element;
  let removeEscListener;

  onMount(() => body = document.body);

  $: if (body) {
    if (backdrop) {
      body.classList.toggle('offcanvas-backdrop', isOpen || isTransitioning);
    }
    if (!scroll) {
      body.classList.toggle('overflow-noscroll', (isOpen || isTransitioning));
    }
  }
  $: if (element) {
    isOpen = isOpen; // Used to trigger reactive on isOpen changes.
    isTransitioning = true;
    setTimeout(() => isTransitioning = false, getTransitionDuration(element));
  }
  $: if (isOpen && toggle) {
    removeEscListener = browserEvent(document, 'keydown', (event) => {
      if (event.key && event.key === 'Escape') toggle();
    });
  }
  $: if (!isOpen && removeEscListener) {
    removeEscListener();
  }
  $: handleMouseDown = (backdrop && toggle && body && isOpen) ? (e) => {
    if (e.target === body) {
      toggle();
    }
  } : undefined;
  $: classes = classnames('offcanvas', `offcanvas-${placement}`, className, { show: isOpen });
</script>

<style>
  :global(.overflow-noscroll) {
    overflow: hidden;
    padding-right: 0px;
  }
</style>

<svelte:body on:mousedown={handleMouseDown} />

<div
  {...$$restProps}
  bind:this={element}
  aria-hidden={!isOpen ? true : undefined}
  aria-modal={isOpen ? true : undefined}
  class={classes}
  role={(isOpen || isTransitioning) ? 'dialog' : undefined}
  style={`visibility: ${isOpen || isTransitioning ? 'visible' : 'hidden'}`}
  tabindex="-1">
  {#if toggle || header || $$slots.header}
    <OffcanvasHeader {toggle}>
      {#if header}
        <h5 class="offcanvas-title">
          {header}
        </h5>
      {/if}
      <slot name="header" />
    </OffcanvasHeader>
  {/if}
  <OffcanvasBody>
    <slot />
  </OffcanvasBody>
</div>
