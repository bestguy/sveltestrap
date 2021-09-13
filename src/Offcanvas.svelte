<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import InlineContainer from './InlineContainer.svelte';
  import OffcanvasBackdrop from './OffcanvasBackdrop.svelte';
  import OffcanvasBody from './OffcanvasBody.svelte';
  import OffcanvasHeader from './OffcanvasHeader.svelte';
  import Portal from './Portal.svelte';
  import classnames, { browserEvent, getTransitionDuration } from './utils';

  const dispatch = createEventDispatcher();

  let className = '';
  export { className as class };
  export let backdrop = true;
  export let body = true;
  export let container = 'body';
  export let fade = true;
  export let header = undefined;
  export let isOpen = false;
  export let placement = 'start';
  export let scroll = false;
  export let style = '';
  export let toggle = undefined;
  export let closeButton = true;

  // TODO support these like Modals:
  // export let autoFocus = true;
  // export let unmountOnClose = true;
  // TODO focus trap

  let bodyElement;
  let isTransitioning = false;
  let element;
  let removeEscListener;

  onMount(() => (bodyElement = document.body));

  $: if (bodyElement) {
    if (!scroll) {
      bodyElement.classList.toggle('overflow-noscroll', isOpen || isTransitioning);
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
  $: if (isOpen && toggle && typeof window !== 'undefined') {
    removeEscListener = browserEvent(document, 'keydown', (event) => {
      if (event.key && event.key === 'Escape') toggle();
    });
  }
  $: if (!isOpen && removeEscListener) {
    removeEscListener();
  }
  $: handleMouseDown =
    backdrop && toggle && bodyElement && isOpen
      ? (e) => {
          if (e.target === bodyElement) {
            toggle();
          }
        }
      : undefined;
  $: classes = classnames('offcanvas', `offcanvas-${placement}`, className, {
    show: isOpen
  });
  $: outer = container === 'inline' ? InlineContainer : Portal;
</script>

<svelte:body on:mousedown={handleMouseDown} />

<svelte:component this={outer}>
  <div
    {...$$restProps}
    bind:this={element}
    aria-hidden={!isOpen ? true : undefined}
    aria-modal={isOpen ? true : undefined}
    class={classes}
    role={isOpen || isTransitioning ? 'dialog' : undefined}
    style={`visibility: ${isOpen || isTransitioning ? 'visible' : 'hidden'};${style}`}
    tabindex="-1"
  >
    {#if (toggle && closeButton) || header || $$slots.header}
      <OffcanvasHeader {toggle} {closeButton}>
        {#if header}{header}{/if}
        <slot name="header" />
      </OffcanvasHeader>
    {/if}
    {#if body}
      <OffcanvasBody>
        <slot />
      </OffcanvasBody>
    {:else}
      <slot />
    {/if}
  </div>
  {#if backdrop}
    <OffcanvasBackdrop on:click={toggle ? () => toggle() : undefined} {fade} {isOpen} />
  {/if}
</svelte:component>

<style>
  :global(.overflow-noscroll) {
    overflow: hidden;
    padding-right: 0px;
  }
</style>
