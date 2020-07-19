<script lang="typescript">
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let inline = false;

  $: classes = classnames(className, inline ? 'form-inline' : false);
</script>

<form {...$$restProps} class={classes} on:submit>
  <slot />
</form>
