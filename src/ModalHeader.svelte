<script>
  import clsx from 'clsx';

  let className = '';
  export {className as class};
  export let toggle = undefined;
  export let closeAriaLabel = 'Close';
  export let charCode = 215;

  $: closeIcon = typeof charCode === 'number' ? String.fromCharCode(charCode) : charCode;

  $: classes = clsx(
    className,
    'modal-header',
  );
</script>

<div class="{classes}">
  <h5 class="modal-title">
    <slot name="content"/>
  </h5>
  <slot name="close">
    {#if typeof toggle === 'function'}
      <button type="button" on:click="{toggle}" class="close" aria-label={closeAriaLabel}>
        <span aria-hidden="true">{closeIcon}</span>
      </button>
    {/if}
  </slot>
</div>
