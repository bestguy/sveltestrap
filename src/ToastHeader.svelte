<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let icon = null;
  export let toggle = null;
  export let closeAriaLabel = 'Close';
  export let charCode = 215;
  export let close = null;

  const props = clean($$props);

  $: classes = clsx(className, 'toast-header');

  $: tagClassName = clsx('mr-auto', { 'ml-2': icon != null });

  $: closeIcon =
    typeof charCode === 'number' ? String.fromCharCode(charCode) : charCode;
</script>

<div {...props} class={classes}>
  {#if icon}
    <svg
      class={`rounded text-${icon}`}
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
      role="img">
      <rect fill="currentColor" width="100%" height="100%" />
    </svg>
  {:else}
    <slot name="icon" />
  {/if}
  <strong class={tagClassName}>
    <slot />
  </strong>
  {#if close}
    {close}
  {:else if toggle}
    <button
      type="button"
      on:click={toggle}
      class="close"
      aria-label={closeAriaLabel}>
      <span aria-hidden="true">{closeIcon}</span>
    </button>
  {/if}
</div>
