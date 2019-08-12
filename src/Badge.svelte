<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let color = 'secondary';
  export let pill = false;
  export let href = undefined;

  $: classes = clsx(
    className,
    'badge',
    `badge-${color}`,
    pill ? 'badge-pill' : false
  );
</script>

{#if href}
<a {href} class="{classes}">
  <slot />
</a>
{:else}
<span class="{classes}">
  <slot />
</span>
{/if}
