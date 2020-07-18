<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let addonType;


  if (['prepend', 'append'].indexOf(addonType) === -1) {
    throw new Error(
      `addonType must be one of 'prepend', 'append'. Received '${addonType}' instead.`
    );
  }

  $: classes = classnames(className, `input-group-${addonType}`);
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
