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
  import { fade as fadeTransition } from 'svelte/transition';
  import InlineContainer from './InlineContainer.svelte';
  import ModalBody from './ModalBody.svelte';
  import ModalHeader from './ModalHeader.svelte';
  import Portal from './Portal.svelte';
  import {
    conditionallyUpdateScrollbar,
    getOriginalBodyPadding,
    setScrollbarWidth
  } from './utils';

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
  export let labelledBy = '';
  export let backdrop = true;
  export let wrapClassName = '';
  export let modalClassName = '';
  export let backdropClassName = '';
  export let contentClassName = '';
  export let fade = true;
  export let backdropDuration = fade ? 150 : 0;
  export let unmountOnClose = true;
  export let returnFocusAfterClose = true;
  export let transitionType = fadeTransition;
  export let transitionOptions = { duration: fade ? 300 : 0 };

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
      const modalOpenClassName = 'modal-open';
      const modalOpenClassNameRegex = new RegExp(
        `(^| )${modalOpenClassName}( |$)`
      );
      document.body.className = document.body.className
        .replace(modalOpenClassNameRegex, ' ')
        .trim();
    }

    manageFocusAfterClose();
    openCount = Math.max(0, openCount - 1);

    setScrollbarWidth(_originalBodyPadding);
  }

  function handleBackdropClick(e) {
    if (e.target === _mouseDownElement) {
      e.stopPropagation();
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
        toggle(e);
      }
    }
  }

  function onModalOpened() {
    dispatch('open');
    _removeEscListener = browserEvent(document, 'keydown', (event) => {
      if (event.key && event.key === 'Escape') {
        if (toggle && backdrop === true) toggle(event);
      }
    });
  }

  function onModalClosed() {
    dispatch('close');
    if (_removeEscListener) {
      _removeEscListener();
    }

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
    <div class={wrapClassName} tabindex="-1" {...$$restProps}>
      {#if isOpen}
        <div
          transition:transitionType={transitionOptions}
          ariaLabelledby={labelledBy}
          class={classnames('modal', modalClassName, {
            show: isOpen,
            'd-block': isOpen,
            'd-none': !isOpen,
            'position-static': staticModal
          })}
          role="dialog"
          on:introstart={() => dispatch('opening')}
          on:introend={onModalOpened}
          on:outrostart={() => dispatch('closing')}
          on:outroend={onModalClosed}
          on:click={handleBackdropClick}
          on:mousedown={handleBackdropMouseDown}
        >
          <slot name="external" />
          <div class={classes} role="document" bind:this={_dialog}>
            <div class={classnames('modal-content', contentClassName)}>
              {#if header}
                <ModalHeader {toggle}>
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
        {#if backdrop && !staticModal}
          <div
            transition:fadeTransition={{ duration: backdropDuration }}
            class={classnames('modal-backdrop', 'show', backdropClassName)}
          />
        {/if}
      {/if}
    </div>
  </svelte:component>
{/if}
