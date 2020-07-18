<script>
  import classnames from './utils';

  let classes = '';
  let className = '';
  export { className as class };
  export let id = '';
  export let captionHeader = '';
  export let captionText = '';


  $: classes = classnames(className, 'carousel-caption', 'd-none', 'd-md-block');
</script>

<div {...$$restProps} {id} class={classes}>
  <h5>{captionHeader}</h5>
  <p>{captionText}</p>
  <slot />
</div>
