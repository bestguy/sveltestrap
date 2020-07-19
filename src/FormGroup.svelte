<script lang="typescript">
  import classnames from './utils';

  export let className = '';
  export { className as class };
  export let row = false;
  export let check = false;
  export let inline = false;
  export let disabled = false;
  export let id = '';
  export let tag = null;

  $: classes = classnames(
    className,
    row ? 'row' : false,
    check ? 'form-check' : 'form-group',
    check && inline ? 'form-check-inline' : false,
    check && disabled ? 'disabled' : false
  );
</script>

{#if tag === 'fieldset'}
  <fieldset {...$$restProps} {id} class={classes}>
    <slot />
  </fieldset>
{:else}
  <div {...$$restProps} {id} class={classes}>
    <slot />
  </div>
{/if}
