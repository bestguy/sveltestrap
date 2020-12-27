<script>
  // TODO: FIX ARROW POSITION
  // TODO: GET CHILDREN DATA 
  // TODO: ARIA LABEL
  // TODO: UNIT TEST
  // TODO: STORY BOOK

  import { onMount } from 'svelte';
  import { createPopper } from '@popperjs/core/lib/popper-lite'
  import classnames from './utils';
  let className = '';
  export { className as class };
  export let target = '';
  export let placement = 'top';

  let isHover = false;

  const randomDigit = () => {
    const min = Math.ceil(0);
    const max = Math.floor(100000);
    return Math.floor(Math.random() * (max - min)) + min
  }

  const tooltipId = `tooltip${randomDigit()}`;

  onMount(() => {
    const tooltip = document.querySelector(`#${tooltipId}`);
    const targetEl = document.querySelector(`#${target}`);
    targetEl.addEventListener('mouseover', () => {
      isHover = true;
    });
    targetEl.addEventListener('mouseleave', () => {
      isHover = false;
    });
  
    createPopper(targetEl, tooltip, {
      placement,
    })
  });

  $: classes = classnames(
    className,
    'tooltip',
    'fade',
    `bs-tooltip-${placement}`,
    isHover ? 'show' : false
  );
</script>

<div id={tooltipId} class={`tooltip fade bs-tooltip-${placement} show`} role="tooltip" x-placement={placement}>
<!-- <div id={tooltipId} class={classes} role="tooltip" x-placement={placement}> -->
  <div class="arrow" data-popper-arrow></div>
  <div class="tooltip-inner">Hello</div>
</div>
