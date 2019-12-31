<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let children = undefined;
  export let color = 'secondary';
  export let href = undefined;
  export let pill = false;

  const props = clean($$props);

  $: classes = clsx(
    className,
    'badge',
    `badge-${color}`,
    pill ? 'badge-pill' : false
  );
</script>

{#if href}
  <a {...props} {href} class={classes}>
    {#if children}
      {children}
    {:else}
      <slot />
    {/if}
  </a>
{:else}
  <span {...props} class={classes}>
    {#if children}
      {children}
    {:else}
      <slot />
    {/if}
  </span>
{/if}
