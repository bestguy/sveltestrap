<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import toggle from './toggle';
  import classnames from './utils';

  const dispatch = createEventDispatcher();
  
  export let isOpen = false;
  let className = '';
  export { className as class };
  export let onEntering = () => {
    show = true;
    dispatch('opening');
  };
  export let onEntered = () => dispatch('open');
  export let onExiting = () => dispatch('closing');
  export let onExited = () => {
    show = false;
    dispatch('close');
  };
  export let renderWhenClosed = false;
  export let toggler = null;

  let show = false;

  onMount(() => toggle(toggler, () => isOpen = !isOpen));

  $: classes = classnames('fade', className, { show: isOpen })
</script>

<div
  {...$$restProps}
  on:transitionstart={() => isOpen ? onEntering() : onExiting()}
  on:transitionend={() => isOpen ? onEntered() : onExited()}
  class={classes}>
  {#if renderWhenClosed}
    <slot />
  {:else if isOpen || show}
      <slot />
  {/if}
</div>
