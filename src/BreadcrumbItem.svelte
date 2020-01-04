<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let active = false;
  export let children = undefined;

  const props = clean($$props);

  $: classes = clsx(className, active ? 'active' : false, 'breadcrumb-item');
</script>

<li {...props} class={classes} aria-current={active ? 'page' : undefined}>
  {#if children}
    {children}
  {:else}
    <slot />
  {/if}
</li>
