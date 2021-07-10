<script>
  import classnames from './utils';

  let classes = '';
  let className = '';
  export let itemIndex = 0;
  export let activeIndex = 0;
  export { className as class };

  $: classes = classnames(className, 'carousel-item');
</script>

<div
  {...$$restProps}
  class="{classes} active"
  class:active={itemIndex === activeIndex}
>
  <slot />
</div>
