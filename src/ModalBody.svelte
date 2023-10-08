<script>
  import classnames from './utils';

  let className = '';
  export { className as class };

  $: classes = classnames(className, 'modal-body');

  $: {
    console.log("SVELTESTRAP@MODALBODY:$");
    console.log("SVELTESTRAP@MODALBODY:$",{classes});
  }
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
