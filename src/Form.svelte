<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let inline = false;
  export let validated = false;

  $: classes = classnames(className, {
    'form-inline': inline,
    'was-validated': validated
  });
</script>

<form {...$$restProps} class={classes} on:submit>
  <slot />
</form>
