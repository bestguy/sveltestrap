<script>
  import { onDestroy, onMount, afterUpdate } from 'svelte';
  import clsx from 'clsx';
  import { getNewCarouselActiveIndex } from './utils';
  
  let classes = ''
  let className = '';
  export { className as class };
  export let id = '';
  export let style = '';
  export let items = [];
  export let activeIndex = 0;
  export let ride = false;
  export let interval = 5000;
  export let pause = true;
  export let keyboard = true;
  let _rideIntervalId = false;

  $: classes = clsx(
    className,
    'carousel',
    'slide',
  );

  onMount(() => {
    setRideInterval();
  });

  onDestroy(() => {
    if(_rideIntervalId) {
      clearInterval(_rideIntervalId);
    }
  });

  function handleKeydown(event) {
    if(!keyboard) {
      return
    }
    
    let direction = '';
    
    if(event.key === 'ArrowLeft') {
      direction = 'prev';
    } else if(event.key === 'ArrowRight') {
      direction = 'next';
    } else {
      return;
    }

    activeIndex = getNewCarouselActiveIndex(direction, items, activeIndex);
  }

  function setRideInterval() {
    if(ride) {
      _rideIntervalId = setInterval(autoNext, interval);
    }
  }

  function clearRideInterval() {
    if(_rideIntervalId) {
      clearInterval(_rideIntervalId);
    }
  }

  function autoNext() {
    activeIndex = getNewCarouselActiveIndex('next', items, activeIndex);
  }
</script>

<svelte:window on:keydown|preventDefault={ handleKeydown }/>

<div
  id="{id}"
  class="{classes}" {style}
  on:mouseenter="{ () => pause ? clearRideInterval() : undefined }"
  on:mouseleave="{ () => pause ? setRideInterval() : undefined }"
>
  <slot />
</div>
