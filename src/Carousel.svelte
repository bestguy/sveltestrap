<script>
  import { onDestroy, onMount } from 'svelte';
  import clsx from 'clsx';
  import { getNewCarouselActiveIndex, browserEvent } from './utils';

  let classes = '';
  let className = '';
  export { className as class };
  export let id = '';
  export let style = '';
  export let items = [];
  export let activeIndex = 0;
  export let ride = true;
  export let interval = 5000;
  export let pause = true;
  export let keyboard = true;
  let _rideTimeoutId = false;
  let _removeVisibilityChangeListener = false;


  $: classes = clsx(className, 'carousel', 'slide');

  onMount(() => {
    setRideTimeout();
  });

  _removeVisibilityChangeListener = browserEvent(
    document,
    'visibilitychange',
    () => {
      if (document.visibilityState === 'hidden') {
        clearRideTimeout();
      } else {
        setRideTimeout();
      }
    }
  );

  onDestroy(() => {
    if (_rideTimeoutId) {
      clearTimeout(_rideTimeoutId);
    }

    if (_removeVisibilityChangeListener) {
      _removeVisibilityChangeListener();
    }
  });

  function handleKeydown(event) {
    if (!keyboard) {
      return;
    }

    let direction = '';

    if (event.key === 'ArrowLeft') {
      direction = 'prev';
    } else if (event.key === 'ArrowRight') {
      direction = 'next';
    } else {
      return;
    }

    activeIndex = getNewCarouselActiveIndex(direction, items, activeIndex);
  }

  function setRideTimeout() {
    clearRideTimeout();

    if (ride) {
      _rideTimeoutId = setTimeout(autoNext, interval);
    }
  }

  function clearRideTimeout() {
    if (_rideTimeoutId) {
      clearTimeout(_rideTimeoutId);
    }
  }

  function autoNext() {
    activeIndex = getNewCarouselActiveIndex('next', items, activeIndex);
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  {...$$restProps}
  {id}
  class={classes}
  {style}
  on:mouseenter={() => (pause ? clearRideTimeout() : undefined)}
  on:mouseleave={() => (pause ? setRideTimeout() : undefined)}>
  <slot />
</div>
