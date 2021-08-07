<script>
  import classnames from './utils';
  let className = '';
  export { className as class };

  $: classes = classnames(className, 'accordion-button');
</script>

<h2 class="accordion-header" {...$$restProps}>
  <button type="button" class={classes} on:click>
    <slot />
  </button>
</h2>
