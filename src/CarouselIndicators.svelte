<script lang="typescript">
  import classnames from './utils';

  let className = '';
  let classes = '';
  export { className as class };
  export let items = [];
  export let activeIndex = 0;
  export let id = '';

  $: classes = classnames(className, 'carousel-indicators');
</script>

<ol {...$$restProps} {id} class={classes}>
  {#each items as item, index}
    <li
      class:active={activeIndex === index}
      on:click={() => (activeIndex = index)} />
  {/each}
</ol>
