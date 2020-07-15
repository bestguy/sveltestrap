<script>
  import clsx from 'clsx';

  let className = '';
  let classes = '';
  export { className as class };
  export let items = [];
  export let activeIndex = 0;
  export let id = '';


  $: classes = clsx(className, 'carousel-indicators');
</script>

<ol {...$$restProps} {id} class={classes}>
  {#each items as item, index}
    <li
      class:active={activeIndex === index}
      on:click={() => (activeIndex = index)} />
  {/each}
</ol>
