<script>
  import { setContext, onDestroy } from 'svelte';
  import { createPopperActions } from './popper';
  import classnames from './utils';

  import { createContext } from './DropdownContext';

  const noop = () => undefined;

  let context = createContext();
  setContext('dropdownContext', context);

  let className = '';
  export { className as class };
  export let active = false;
  export let direction = 'down';
  export let dropup = false;
  export let group = false;
  export let inNavbar = false;
  export let isOpen = false;
  export let nav = false;
  export let setActiveFromChild = false;
  export let size = '';
  export let toggle = undefined;

  const [popperRef, popperContent] = createPopperActions();

  const validDirections = ['up', 'down', 'left', 'right', 'start', 'end'];

  if (validDirections.indexOf(direction) === -1) {
    throw new Error(
      `Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right', 'start', 'end'`
    );
  }

  let component;
  let dropdownDirection;

  $: subItemIsActive = !!(
    setActiveFromChild &&
    component &&
    typeof component.querySelector === 'function' &&
    component.querySelector('.active')
  );

  $: {
    if (direction === 'left') dropdownDirection = 'start';
    else if (direction === 'right') dropdownDirection = 'end';
    else dropdownDirection = direction;
  }

  $: classes = classnames(
    className,
    direction !== 'down' && `drop${dropdownDirection}`,
    nav && active ? 'active' : false,
    setActiveFromChild && subItemIsActive ? 'active' : false,
    {
      'btn-group': group,
      [`btn-group-${size}`]: !!size,
      dropdown: !group,
      show: isOpen,
      'nav-item': nav
    }
  );

  $: {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        ['click', 'touchstart', 'keyup'].forEach((event) =>
          document.addEventListener(event, handleDocumentClick, true)
        );
      } else {
        ['click', 'touchstart', 'keyup'].forEach((event) =>
          document.removeEventListener(event, handleDocumentClick, true)
        );
      }
    }
  }

  $: {
    context.update(() => {
      return {
        toggle: handleToggle,
        isOpen,
        direction: direction === 'down' && dropup ? 'up' : direction,
        inNavbar: nav || inNavbar,
        popperRef: nav ? noop : popperRef,
        popperContent: nav ? noop : popperContent
      };
    });
  }

  $: handleToggle = toggle || (() => (isOpen = !isOpen));

  function handleDocumentClick(e) {
    if (e && (e.which === 3 || (e.type === 'keyup' && e.which !== 9))) return;

    if (
      component.contains(e.target) &&
      component !== e.target &&
      (e.type !== 'keyup' || e.which === 9)
    ) {
      return;
    }

    handleToggle(e);
  }

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      ['click', 'touchstart', 'keyup'].forEach((event) =>
        document.removeEventListener(event, handleDocumentClick, true)
      );
    }
  });
</script>

{#if nav}
  <li {...$$restProps} class={classes} bind:this={component}>
    <slot />
  </li>
{:else}
  <div {...$$restProps} class={classes} bind:this={component}>
    <slot />
  </div>
{/if}
