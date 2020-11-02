<script>
  import classnames from './utils';

  export let className = '';
  export { className as class };
  export let check = false;
  export let disabled = false;
  export let inline = false;
  export let row = false;
  export let tag = null;

  $: classes = classnames(
    className,
    'mb-3',
    {
      row,
      'form-check': check,
      'form-check-inline': check && inline,
      disabled: check && disabled
    }
  );
</script>

{#if tag === 'fieldset'}
  <fieldset {...$$restProps} class={classes}>
    <slot />
  </fieldset>
{:else}
  <div {...$$restProps} class={classes}>
    <slot />
  </div>
{/if}
