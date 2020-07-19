<script>
  import { onMount, onDestroy } from 'svelte';

  import Fade from './Fade.svelte';

  const noop = () => undefined;

  let className = '';
  export { className as class };
  export let defaultOpen = false;
  export let toggler;
  export let onEntering = noop;
  export let onEntered = noop;
  export let onExiting = noop;
  export let onExited = noop;

  let unbindEvents;
  let isOpen = defaultOpen;
  function togglerFn() {
    isOpen = !isOpen;
  }

  const defaultToggleEvents = ['touchstart', 'click'];

  onMount(() => {
    if (
      typeof toggler === 'string' &&
      typeof window !== 'undefined' &&
      document &&
      document.createElement
    ) {
      let selection = document.querySelectorAll(toggler);
      if (!selection.length) {
        selection = document.querySelectorAll(`#${toggler}`);
      }
      if (!selection.length) {
        throw new Error(
          `The target '${toggler}' could not be identified in the dom, tip: check spelling`
        );
      }

      defaultToggleEvents.forEach((event) => {
        selection.forEach((element) => {
          element.addEventListener(event, togglerFn);
        });
      });

      unbindEvents = () => {
        defaultToggleEvents.forEach((event) => {
          selection.forEach((element) => {
            element.removeEventListener(event, togglerFn);
          });
        });
      };
    }
  });

  onDestroy(() => {
    if (typeof unbindEvents === 'function') {
      unbindEvents();
      unbindEvents = undefined;
    }
  });
</script>

<Fade
  {...$$restProps}
  {isOpen}
  on:introstart
  on:introend
  on:outrostart
  on:outroend
  on:introstart={onEntering}
  on:introend={onEntered}
  on:outrostart={onExiting}
  on:outroend={onExited}
  class={className}>
  <slot />
</Fade>
