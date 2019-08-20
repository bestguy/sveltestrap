<script>
  import clsx from 'clsx';
  import { fade as fadeTrans } from 'svelte/transition';

  let className = '';
  export { className as class };
  export let fade = true;
  export let isOpen = true;

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'toast',
    {
      show: isOpen,
    },
  );
</script>

{#if isOpen}
<div
  {...props}
  class="{classes}"
  transition:fadeTrans
  role="alert"
>
  <slot />
</div>
{/if}
