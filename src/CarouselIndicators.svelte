<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let items = [];
  export let activeIndex = 0;
  export let id = '';

  const props = clean($$props);

  $: classes = clsx(
    className,
    'carousel-indicators',
  );
</script>

<ol id="{id}" class="{classes}">
  {#each items as item, index}
    <li class:active={activeIndex === index} on:click="{ e => activeIndex = index }"></li>
  {/each}
</ol>
