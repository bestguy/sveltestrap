<script lang="typescript">
  import classnames from './utils';
  import { fade as fadeTrans } from 'svelte/transition';

  let className = '';
  export { className as class };
  export let duration = 200;
  export let fade = true;
  export let isOpen = true;

  $: classes = classnames(className, 'toast', {
    show: isOpen
  });
</script>

{#if isOpen}
  <div
    {...$$restProps}
    class={classes}
    transition:fadeTrans={{ duration: fade && duration }}
    role="alert">
    <slot />
  </div>
{/if}
