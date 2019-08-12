<script>
  import clsx from 'clsx';

  export let className = '';
  export { className as class };
  export let row = false;
  export let check = false;
  export let inline = false;
  export let disabled = false;
  export let id = '';
  export let tag = null;

  $: classes = clsx(
    className,
    row ? 'row' : false,
    check ? 'form-check' : 'form-group',
    check && inline ? 'form-check-inline' : false,
    check && disabled ? 'disabled' : false,
  );

</script>

{#if tag === 'fieldset'}
  <fieldset {id} class="{classes}">
    <slot />
  </fieldset>
{:else}
  <div {id} class="{classes}">
    <slot />
  </div>
{/if}
