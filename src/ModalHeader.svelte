<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let toggle = undefined;
  export let closeAriaLabel = 'Close';
  export let children = undefined;
  export let id = undefined;

  $: classes = classnames(className, 'modal-header');
</script>

<div {...$$restProps} class={classes}>
  <h5 class="modal-title" {id}>
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
        class="btn-close"
        aria-label={closeAriaLabel}
      />
    {/if}
  </slot>
</div>
