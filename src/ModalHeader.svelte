<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let toggle = undefined;
  export let closeAriaLabel = 'Close';
  export let charCode = 215;
  export let children = undefined;

  $: closeIcon =
    typeof charCode === 'number' ? String.fromCharCode(charCode) : charCode;

  $: classes = classnames(className, 'modal-header');
</script>

<div {...$$restProps} class={classes}>
  <h5 class="modal-title">
    {#if children}
      {children}
    {:else}
      <slot />
    {/if}
  </h5>
  <slot name="close">
    {#if typeof toggle === 'function'}
      <button
        type="button"
        on:click={toggle}
        class="close"
        aria-label={closeAriaLabel}>
        <span aria-hidden="true">{closeIcon}</span>
      </button>
    {/if}
  </slot>
</div>
