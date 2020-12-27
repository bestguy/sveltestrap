<script>
  // TODO: ON MOUSE OVER EVENT
  // TODO: ON MOUSE LEAVE EVENT
  // TODO: FIX ARROW POSITION
  // TODO: GET CHILDREN DATA 
  // TODO: ADD CLASSNAME WITH UTILS

  import { onMount } from 'svelte';
  import { createPopper } from '@popperjs/core/lib/popper-lite'
  // import classnames from './utils';
  let className = '';
  // export { className as class };
  export let target = '';
  export let placement = 'top';

  const randomDigit = () => {
    const min = Math.ceil(0);
    const max = Math.floor(100000);
    return Math.floor(Math.random() * (max - min)) + min
  }

  const tooltipId = `tooltip${randomDigit()}`;

  onMount(() => {
    const tooltip = document.querySelector(`#${tooltipId}`);
    const targetEl = document.querySelector(`#${target}`);
  
    createPopper(targetEl, tooltip, {
      placement,
    })
  });
</script>

<h1>targetId: {target}</h1>

<div id={tooltipId} class={`tooltip fade bs-tooltip-${placement} show`} role="tooltip" x-placement={placement}>
  <div class="arrow" data-popper-arrow></div>
  <div class="tooltip-inner">Hello</div>
</div>
