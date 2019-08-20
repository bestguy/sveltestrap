<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let fluid = false;
  export let tag = 'div';

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'jumbotron',
    fluid ? 'jumbotron-fluid' : false,
  );
</script>


{#if tag === 'section'}
  <section {...props} class="{classes}">
    <slot/>
  </section>
{:else}
  <div {...props} class="{classes}">
    <slot/>
  </div>
{/if}
