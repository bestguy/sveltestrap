<script>
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { fade as fadeTrans } from 'svelte/transition';
  import ToastBody from './ToastBody.svelte';
  import ToastHeader from './ToastHeader.svelte';
  import classnames from './utils';

  const dispatch = createEventDispatcher();

  let className = '';
  export { className as class };
  export let autohide = false;
  export let body = false;
  export let delay = 5000;
  export let duration = 200;
  export let fade = true;
  export let header;
  export let isOpen = true;
  export let toggle = null;

  let timeout;

  onDestroy(() => {
    return () => clearTimeout(timeout);
  });

  $: if (isOpen && autohide) {
    timeout = setTimeout(() => isOpen = false, delay);
  }

  $: classes = classnames(className, 'toast', {
    show: isOpen
  });
</script>

{#if isOpen}
  <div
    {...$$restProps}
    class={classes}
    transition:fadeTrans={{ duration: fade && duration }}
    on:introstart={() => dispatch('opening')}
    on:introend={() => dispatch('open')}
    on:outrostart={() => dispatch('closing')}
    on:outroend={() => dispatch('close')}
    role="alert">
    {#if header}
      <ToastHeader {toggle}>
        {header}
      </ToastHeader>
    {/if}
    {#if body}
      <ToastBody>
        <slot />
      </ToastBody>
    {:else}
      <slot />
    {/if}
  </div>
{/if}
