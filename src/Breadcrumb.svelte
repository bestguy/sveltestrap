<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let ariaLabel = 'breadcrumb';
  export let children;
  export let listClassName = '';

  const props = clean($$props);

  $: listClasses = clsx(
    'breadcrumb',
    listClassName
  );
</script>

<nav {...props} aria-label="{ariaLabel}" class="{className}">
  <ol class="{listClasses}">
    {#if children}
      {children}
    {:else}
      <slot />
    {/if}
  </ol>
</nav>

