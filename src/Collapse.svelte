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

  onMount(() => toggle(toggler, (e) => {
    isOpen = !isOpen;
    e.preventDefault();
  }));

  $: classes = classnames(className, {
    'collapse-horizontal': horizontal,
    'navbar-collapse': navbar,
    'd-none': !isOpen
  });

  function notify() {
    dispatch('update', isOpen);
  }
</script>

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
  on:introstart={onEntering}
  on:introend={onEntered}
  on:outrostart={onExiting}
  on:outroend={onExited}
>
  <slot />
</div>
