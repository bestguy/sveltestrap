<script>
  import classnames from './utils';

  let className = '';
  let classes = '';
  export { className as class };
  export let items = [];
  export let activeIndex = 0;

  $: classes = classnames(className, 'carousel-indicators');
</script>

<div {...$$restProps} class={classes}>
  {#each items as item, index}
    <button
      data-bs-target
      class:active={activeIndex === index}
      aria-current={activeIndex === index}
      aria-label={item.title}
      on:click={() => (activeIndex = index)}
    >
      {item.title ? item.title : ''}
    </button>
  {/each}
</div>
