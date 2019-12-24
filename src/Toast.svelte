<script>
  import clsx from 'clsx';
  import { clean } from './utils';
  import { fade as fadeTrans } from 'svelte/transition';

  let className = '';
  export { className as class };
  export let duration = 200;
  export let fade = true;
  export let isOpen = true;

  const props = clean($$props);

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
  transition:fadeTrans={{duration: fade && duration}}
  role="alert"
>
  <slot />
</div>
{/if}
