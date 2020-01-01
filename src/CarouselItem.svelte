<script>
  import clsx from 'clsx';
  import { clean } from './utils';
  //import { fade, slide, fly, blur } from 'svelte/transition';
  //import { quintOut } from 'svelte/easing';

  let className = '';
  export let id = '';
  export let itemIndex = 0;
  export let activeIndex = 0;
  export { className as class };

  const props = clean($$props);

  $: classes = clsx(
    className,
    'carousel-item',
  );
</script>

<div id="{id}" class="{classes} active" class:active="{itemIndex === activeIndex}">
  <slot />
</div>