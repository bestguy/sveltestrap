<script>
  import clsx from 'clsx';
  import { getNewCarouselActiveIndex } from './utils';
  import { clean } from './utils';

  let classes = '';
  let className = '';
  let srText = '';
  export { className as class };
  export let id = '';
  export let direction = '';
  export let directionText = '';
  export let activeIndex = 0;
  export let items = [];
  export let wrap = true;

  const props = clean($$props);

  $: classes = clsx(`carousel-control-${direction}`, className);

  const getSrText = direction => {
    if (direction === 'next') {
      return 'Next';
    } else if (direction === 'prev') {
      return 'Previous';
    }
  };

  $: srText = directionText ? directionText : getSrText(direction);

  function clickHandler() {
    const endOrBeginning =
      (direction === 'next' && activeIndex + 1 > items.length - 1) ||
      (direction === 'previous' && activeIndex - 1 < 0);

    if (!wrap && endOrBeginning) {
      return;
    }

    activeIndex = getNewCarouselActiveIndex(direction, items, activeIndex);
  }
</script>

<a
  {...props}
  {id}
  class={classes}
  role="button"
  href="#{direction}"
  on:click|preventDefault={clickHandler}>
  <span class="carousel-control-{direction}-icon" aria-hidden="true" />
  <span class="sr-only">{srText}</span>
</a>
