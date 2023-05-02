<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { collapseIn, collapseOut } from './transitions';
  import classnames from './utils';
  import toggle from './toggle';

  const dispatch = createEventDispatcher();

  export let isOpen = false;
  let className = '';
  export { className as class };
  export let horizontal = false;
  export let navbar = false;
  export let onEntering = () => dispatch('opening');
  export let onEntered = () => dispatch('open');
  export let onExiting = () => dispatch('closing');
  export let onExited = () => dispatch('close');
  export let toggler = null;
  let transitioning = false;

  onMount(() => toggle(toggler, (e) => {
    if (!transitioning) {
      isOpen = !isOpen;
    }
  }));

  $: classes = classnames(className, {
    'collapse-horizontal': horizontal,
    'navbar-collapse': navbar,
    'd-none': !isOpen
  });

  function notify() {
    dispatch('update', isOpen);
  }
  

  function _onEntering(event) {
    transitioning = true;
    onEntering(event);
  }
  
  function _onEntered(event) {
    transitioning = false;
    onEntered(event);
  }
  
  function _onExiting(event) {
    transitioning = true;
    onExiting(event);
  }
  
  function _onExited(event) {
    transitioning = false;
    onExited(event);
  }
</script>

{#key isOpen}
  <div
      style={navbar ? undefined : 'overflow: hidden;'}
      {...$$restProps}
      class={classes}
      in:collapseIn={{ horizontal }}
      out:collapseOut|local={{ horizontal }}
      on:introstart
      on:introend
      on:outrostart
      on:outroend
      on:introstart={_onEntering}
      on:introend={_onEntered}
      on:outrostart={_onExiting}
      on:outroend={_onExited}
  >
    <slot />
  </div>
{/key}
