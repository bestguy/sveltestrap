<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  export let className = '';
  export { className as class };
  export let row = false;
  export let check = false;
  export let inline = false;
  export let disabled = false;
  export let id = '';
  export let tag = null;

  const props = clean($$props);

  $: classes = clsx(
    className,
    row ? 'row' : false,
    check ? 'form-check' : 'form-group',
    check && inline ? 'form-check-inline' : false,
    check && disabled ? 'disabled' : false,
  );

</script>

{#if tag === 'fieldset'}
  <fieldset {...props} {id} class="{classes}">
    <slot />
  </fieldset>
{:else}
  <div {...props} {id} class="{classes}">
    <slot />
  </div>
{/if}
