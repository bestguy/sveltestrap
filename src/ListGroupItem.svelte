<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export {className as class};
  export let active = false;
  export let disabled = false;
  export let color = '';
  export let action = false;
  export let href = null;
  export let tag = null;

  const props = clean($$props);

  $: classes = clsx(
    className,
    active ? 'active' : false,
    disabled ? 'disabled' : false,
    action ? 'list-group-item-action' : false,
    color ? `list-group-item-${color}` : false,
    'list-group-item',
  );
</script>

{#if href}
  <a {...props} class="{classes}" {href} {disabled} {active}>
    <slot/>
  </a>
{:else if tag === 'button'}
  <button {...props} class="{classes}" type="button" on:click {disabled} {active}>
    <slot/>
  </button>
{:else}
<li {...props} class="{classes}" {disabled} {active}>
  <slot/>
</li>
{/if}
