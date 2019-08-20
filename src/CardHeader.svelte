<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let id = '';
  export let tag = 'div';

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    className,
    'card-header',
  );
</script>

{#if tag === 'h3'}
  <h3 {...props} {id} class="{classes}" on:click>
    <slot />
  </h3>
{:else}
  <div {...props} {id} class="{classes}" on:click>
    <slot />
  </div>
{/if}
