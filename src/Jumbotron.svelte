<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let fluid = false;
  export let tag = 'div';

  const props = clean($$props);

  $: classes = clsx(className, 'jumbotron', fluid ? 'jumbotron-fluid' : false);
</script>

{#if tag === 'section'}
  <section {...props} class={classes}>
    <slot />
  </section>
{:else}
  <div {...props} class={classes}>
    <slot />
  </div>
{/if}
