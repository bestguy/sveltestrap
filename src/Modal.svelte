<script context="module">
  // TODO fade option
  let openCount = 0;
</script>

<script>
  import classnames from './utils';
  import { browserEvent } from './utils';
  import {
    createEventDispatcher,
    onDestroy,
    onMount,
    afterUpdate
  } from 'svelte';
  import { modalIn, modalOut } from './transitions';
  import InlineContainer from './InlineContainer.svelte';
  import ModalBackdrop from './ModalBackdrop.svelte';
  import ModalBody from './ModalBody.svelte';
  import ModalHeader from './ModalHeader.svelte';
  import Portal from './Portal.svelte';
  import {
    conditionallyUpdateScrollbar,
    getOriginalBodyPadding,
    setScrollbarWidth,
    uuid
  } from './utils';
  import { fade as svFade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  let className = '';
  let staticModal = false;
  export { className as class };
  export { staticModal as static };
  export let isOpen = false;
  export let autoFocus = true;
  export let body = false;
  export let centered = false;
  export let container = undefined;
  export let fullscreen = false;
  export let header = undefined;
  export let scrollable = false;
  export let size = '';
  export let toggle = undefined;
  export let labelledBy = header ? `modal-${uuid()}` : undefined;
  export let backdrop = true;
  export let wrapClassName = '';
  export let modalClassName = '';
  export let contentClassName = '';
  export let fade = true;
  export let unmountOnClose = true;
  export let returnFocusAfterClose = true;

  let hasOpened = false;
  let _isMounted = false;
  let _triggeringElement;
  let _originalBodyPadding;
  let _lastIsOpen = isOpen;
  let _lastHasOpened = hasOpened;
  let _dialog;
  let _mouseDownElement;
  let _removeEscListener;

  onMount(() => {
    if (isOpen) {
      init();
      hasOpened = true;
    }

    if (hasOpened && autoFocus) {
      setFocus();
    }
  });

  onDestroy(() => {
    destroy();
    if (hasOpened) {
      close();
    }
  });

  afterUpdate(() => {
    if (isOpen && !_lastIsOpen) {
      init();
      hasOpened = true;
    }

    if (autoFocus && hasOpened && !_lastHasOpened) {
      setFocus();
    }

    _lastIsOpen = isOpen;
    _lastHasOpened = hasOpened;
  });

  function setFocus() {
    if (
      _dialog &&
      _dialog.parentNode &&
      typeof _dialog.parentNode.focus === 'function'
    ) {
      _dialog.parentNode.focus();
    }
  }

  function init() {
    try {
      _triggeringElement = document.activeElement;
    } catch (err) {
      _triggeringElement = null;
    }

    if (!staticModal) {
      _originalBodyPadding = getOriginalBodyPadding();
      conditionallyUpdateScrollbar();
      if (openCount === 0) {
        document.body.className = classnames(
          document.body.className,
          'modal-open'
        );
      }

      ++openCount;
    }
    _isMounted = true;
  }

  function manageFocusAfterClose() {
    if (_triggeringElement) {
      if (
        typeof _triggeringElement.focus === 'function' &&
        returnFocusAfterClose
      ) {
        _triggeringElement.focus();
      }

      _triggeringElement = null;
    }
  }

  function destroy() {
    manageFocusAfterClose();
  }

  function close() {
    if (openCount <= 1) {
      document.body.classList.remove('modal-open');
    }

    manageFocusAfterClose();
    openCount = Math.max(0, openCount - 1);

    setScrollbarWidth(_originalBodyPadding);
  }

  function handleBackdropClick(e) {
    if (e.target === _mouseDownElement) {
      if (!isOpen || !backdrop) {
        return;
      }

      const backdropElem = _dialog ? _dialog.parentNode : null;
      if (
        backdrop === true &&
        backdropElem &&
        e.target === backdropElem &&
        toggle
      ) {
        e.stopPropagation();
        toggle(e);
      }
    }
  }

  function onModalOpened() {
    dispatch('open');
    _removeEscListener = browserEvent(document, 'keydown', (event) => {
      if (event.key && event.key === 'Escape') {
        if (toggle && backdrop === true) {
          if (_removeEscListener) _removeEscListener();
          toggle(event);
        }
      }
    });
  }

  function onModalClosing() {
    dispatch('closing');
    if (_removeEscListener) {
      _removeEscListener();
    }
  }

  function onModalClosed() {
    dispatch('close');
    if (unmountOnClose) {
      destroy();
    }
    close();
    if (_isMounted) {
      hasOpened = false;
    }
    _isMounted = false;
  }

  function handleBackdropMouseDown(e) {
    _mouseDownElement = e.target;
  }

  const dialogBaseClass = 'modal-dialog';

  $: classes = classnames(dialogBaseClass, className, {
    [`modal-${size}`]: size,
    'modal-fullscreen': fullscreen === true,
    [`modal-fullscreen-${fullscreen}-down`]:
      fullscreen && typeof fullscreen === 'string',
    [`${dialogBaseClass}-centered`]: centered,
    [`${dialogBaseClass}-scrollable`]: scrollable
  });

  $: outer = container === 'inline' || staticModal ? InlineContainer : Portal;
</script>

{#if _isMounted}
  <svelte:component this={outer}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class={wrapClassName} tabindex="-1" {...$$restProps}>
      {#if isOpen}
        <div
          in:modalIn|global
          out:modalOut|global
          aria-labelledby={labelledBy}
          class={classnames('modal', modalClassName, {
            fade,
            'position-static': staticModal
          })}
          role="dialog"
          on:introstart={() => dispatch('opening')}
          on:introend={onModalOpened}
          on:outrostart={onModalClosing}
          on:outroend={onModalClosed}
          on:click={handleBackdropClick}
          on:mousedown={handleBackdropMouseDown}
        >
          <slot name="external" />
          <div class={classes} role="document" bind:this={_dialog}>
            <div class={classnames('modal-content', contentClassName)}>
              {#if header}
                <ModalHeader {toggle} id={labelledBy}>
                  {header}
                </ModalHeader>
              {/if}
              {#if body}
                <ModalBody>
                  <slot />
                </ModalBody>
              {:else}
                <slot />
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </svelte:component>
{/if}
{#if backdrop && !staticModal}
  <svelte:component this={outer}>
    <ModalBackdrop {fade} {isOpen} />
  </svelte:component>
{/if}

<style>
  :global(.modal-open) {
    overflow: hidden;
    padding-right: 0;
  }
</style>
