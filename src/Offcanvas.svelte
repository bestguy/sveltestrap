<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import InlineContainer from './InlineContainer.svelte';
  import ModalBackdrop from './ModalBackdrop.svelte';
  import OffcanvasBody from './OffcanvasBody.svelte';
  import OffcanvasHeader from './OffcanvasHeader.svelte';
  import Portal from './Portal.svelte';
  import { backdropIn, backdropOut } from './transitions.js';
  import classnames, { browserEvent, getTransitionDuration } from './utils';

  const dispatch = createEventDispatcher();

  let className = '';
  export { className as class };
  export let backdrop = true;
  export let container = 'body';
  export let fade = true;
  export let backdropDuration = fade ? 150 : 0;
  export let header = undefined;
  export let isOpen = false;
  export let placement = 'start';
  export let scroll = false;
  export let toggle = undefined;

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
    if (!scroll) {
      body.classList.toggle('overflow-noscroll', (isOpen || isTransitioning));
    }
  }
  $: if (element) {
    isOpen = isOpen; // Used to trigger reactive on isOpen changes.
    isTransitioning = true;
    dispatch(isOpen ? 'opening' : 'closing');
    setTimeout(() => {
      isTransitioning = false;
      dispatch(isOpen ? 'open' : 'close');
    }, getTransitionDuration(element));
  }
  $: if (isOpen && toggle && (typeof window !== 'undefined')) {
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
  $: outer = (container === 'inline') ? InlineContainer : Portal;
</script>

<style>
  :global(.overflow-noscroll) {
    overflow: hidden;
    padding-right: 0px;
  }
</style>

<svelte:body on:mousedown={handleMouseDown} />

<svelte:component this={outer}>
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
{#if backdrop}
  <ModalBackdrop
    on:click={toggle ? () => toggle() : undefined}
    {isOpen} />
{/if}
</svelte:component>
