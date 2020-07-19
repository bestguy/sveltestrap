<script lang="typescript">
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let fluid = false;
  export let tag = 'div';

  $: classes = classnames(
    className,
    'jumbotron',
    fluid ? 'jumbotron-fluid' : false
  );
</script>

{#if tag === 'section'}
  <section {...$$restProps} class={classes}>
    <slot />
  </section>
{:else}
  <div {...$$restProps} class={classes}>
    <slot />
  </div>
{/if}
