<script context="module">
  // TODO fade option, esc key
  let openCount = 0;
</script>

<script>
  import clsx from 'clsx';
  import { clean } from './utils';
  import { onDestroy, onMount, afterUpdate } from 'svelte';
  import { fade } from 'svelte/transition';

  import { conditionallyUpdateScrollbar, getOriginalBodyPadding, setScrollbarWidth } from './utils';

  function noop() { }

  let className = '';
  export {className as class};
  export let isOpen;
  export let autoFocus = true;
  export let centered = false;
  export let duration = 0;
  export let backdropDuration = duration;
  export let scrollable = false;
  export let size = '';
  export let toggle = undefined;
  export let keyboard = true;
  export let role = 'dialog';
  export let labelledBy = '';
  export let backdrop = true;
  export let onEnter = undefined;
  export let onExit = undefined;
  export let onOpened = noop;
  export let onClosed = noop;
  export let wrapClassName = '';
  export let modalClassName = '';
  export let backdropClassName = '';
  export let contentClassName = '';
  export let external = undefined;
  export let zIndex = 1050;
  export let backdropTransition = '';
  export let modalTransition = '';
  export let unmountOnClose = true;
  export let returnFocusAfterClose = true;

  const props = clean($$props);

  let hasOpened = false;
  let _isMounted = false;
  let _triggeringElement;
  let _originalBodyPadding;
  let _lastIsOpen = isOpen;
  let _lastHasOpened = hasOpened;
  let _dialog;
  let _mouseDownElement;

  onMount(() => {
    if (isOpen) {
      init();
      hasOpened = true;
    }

    if (typeof onEnter === 'function') {
      onEnter();
    }

    if (hasOpened && autoFocus) {
      setFocus();
    }

  });

  onDestroy(() => {
    if (typeof onExit === 'function') {
      onExit();
    }

    destroy();
    if (hasOpened) {
      close();
    }
  });

  afterUpdate (() => {
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

    if (_dialog && _dialog.parentNode && typeof _dialog.parentNode.focus === 'function') {
      _dialog.parentNode.focus();
    }
  }

  function init() {
    try {
      _triggeringElement = document.activeElement;
    } catch (err) {
      _triggeringElement = null;
    }

    _originalBodyPadding = getOriginalBodyPadding();
    conditionallyUpdateScrollbar();
    if (openCount === 0) {
      document.body.className = clsx(
        document.body.className,
        'modal-open',
      );
    }

    ++openCount;
    _isMounted = true;
  }

  function manageFocusAfterClose() {
    if (_triggeringElement) {
      if (typeof _triggeringElement.focus === 'function' && returnFocusAfterClose) {
        _triggeringElement.focus()
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
      const modalOpenClassNameRegex = new RegExp(`(^| )${modalOpenClassName}( |$)`);
      document.body.className = document.body.className.replace(modalOpenClassNameRegex, ' ').trim();
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
      if (backdropElem && e.target === backdropElem && toggle) {
        toggle(e);
      }
    }
  }

  function onModalClosed() {
    onClosed();

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

  $: classes = clsx(
    dialogBaseClass,
    className,
    {
      [`modal-${size}`]: size,
      [`${dialogBaseClass}-centered`]: centered,
      [`${dialogBaseClass}-scrollable`]: scrollable,
    }
  );
</script>

{#if _isMounted}
<div {...props} class="{wrapClassName}" tabindex="-1" style="position: relative; z-index: {zIndex}">
  {#if isOpen}
    <div
      transition:fade={{duration}}
      class="{clsx('modal', 'show', modalClassName)}"
      style="display: block;"
      on:outroend="{onModalClosed}"
      on:click="{handleBackdropClick}"
      on:mousedown="{handleBackdropMouseDown}"
    >
      <div
        class="{classes}"
        role="document"
        bind:this="{_dialog}"
      >
        <div class="{clsx('modal-content', contentClassName)}">
          <slot />
        </div>
      </div>
    </div>
    <div transition:fade={{duration: backdropDuration}} class="{clsx('modal-backdrop', 'show', backdropClassName)}" />
  {/if}
</div>
{/if}
