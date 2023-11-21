<script>
  import classnames from './utils.ts';

  export let className = '';
  export { className as class };
  export let check = false;
  export let disabled = false;
  export let floating = false;
  export let inline = false;
  export let label = '';
  export let row = false;
  export let tag = null;

  $: classes = classnames(className, 'mb-3', {
    row,
    'form-check': check,
    'form-check-inline': check && inline,
    'form-floating': floating,
    disabled: check && disabled
  });
</script>

{#if tag === 'fieldset'}
  <fieldset {...$$restProps} class={classes}>
    <slot />
    {#if label || $$slots.label}
      <label>
        {label}
        <slot name="label" />
      </label>
    {/if}
  </fieldset>
{:else}
  <div {...$$restProps} class={classes}>
    <slot />
    {#if label || $$slots.label}
      <label>
        {label}
        <slot name="label" />
      </label>
    {/if}
  </div>
{/if}
