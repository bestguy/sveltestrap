<script>
  import classnames from './utils';

  let className = '';
  let classes = '';
  export { className as class };
  export let items = [];
  export let activeIndex = 0;

  $: classes = classnames(className, 'carousel-indicators');
</script>

<ol {...$$restProps} class={classes}>
  {#each items as _item, index}
    <li
      class:active={activeIndex === index}
      on:click={() => (activeIndex = index)} />
  {/each}
</ol>
