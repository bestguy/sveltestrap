<script>
  import classnames from './utils';

  let className = '';
  export { className as class };

  $: classes = classnames(className, 'navbar-toggler');
</script>

<button {...$$restProps} on:click class={classes}>
  <slot>
    <span class="navbar-toggler-icon" />
  </slot>
</button>
