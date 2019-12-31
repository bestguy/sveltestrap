<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let inline = false;

  const props = clean($$props);

  $: classes = clsx(className, inline ? 'form-inline' : false);
</script>

<form {...props} class={classes}>
  <slot />
</form>
