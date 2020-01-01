<script>
  import clsx from 'clsx';
  import { onDestroy } from 'svelte';
  import { clean, browserEvent } from './utils';

  let className = '';
  export { className as class };
  export let direction = '';
  export let directionText = '';
  export let activeIndex = 0;
  export let items = [];
  export let wrap = true;
  export let keyboard = true;
  let _removeListener;

  $: classes = clsx(
    `carousel-control-${direction}`,
    className
  );

  $: arrowKey = direction === 'prev' ? 'ArrowLeft' : 'ArrowRight';

  const getSrText = (direction) => {
    if(direction === 'next') {
      return 'Next';
    } else if(direction === 'prev') {
      return 'Previous';
    }
  };

  onDestroy(() => {
    if(_removeListener) {
      _removeListener();
    }
  });

  function changeActiveIndex(event) {
    event.preventDefault();
    
    if(direction === 'prev') {
      if(activeIndex -1 < 0 && !wrap) {
        return;
      }

      activeIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    } else if(direction === 'next') {
      if(activeIndex + 1 > items.length - 1 && !wrap) {
        return;
      }

      activeIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    }
  }

  if(keyboard) {
    _removeListener = browserEvent(document, 'keydown', (event) => {
      if(event.key === arrowKey) {
        changeActiveIndex(event);
      }
    })
  }

  $: srText = directionText ? directionText : getSrText(direction);
</script>

<a class="{classes}" role="button" href="#{direction}" on:click="{ e => changeActiveIndex(e, direction) }">
  <span class="carousel-control-{direction}-icon" aria-hidden="true"></span>
  <span class="sr-only">{srText}</span>
</a>