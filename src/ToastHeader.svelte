<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let icon = null;
  export let toggle = null;
  export let closeAriaLabel = 'Close';
  export let close = null;

  $: classes = classnames(className, 'toast-header');

  $: tagClassName = classnames('mr-auto', { 'ml-2': icon != null });
</script>

<div {...$$restProps} class={classes}>
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
      class="btn-close"
      aria-label={closeAriaLabel} />
  {/if}
</div>
