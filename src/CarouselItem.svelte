<script>
  import classnames from './utils';

  let classes = '';
  let className = '';
  export let id = '';
  export let itemIndex = 0;
  export let activeIndex = 0;
  export { className as class };

  $: classes = classnames(className, 'carousel-item');
</script>

<div
  {...$$restProps}
  {id}
  class="{classes} active"
  class:active={itemIndex === activeIndex}>
  <slot />
</div>
