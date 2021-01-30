<script>
  import classnames from './utils';

  import Button from './Button.svelte';

  let className = '';
  export { className as class };

  $: classes = classnames(className, 'navbar-toggler');
</script>

<Button {...$$restProps} on:click class={classes}>
  <slot>
    <span class="navbar-toggler-icon" />
  </slot>
</Button>
