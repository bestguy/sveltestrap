<script>
  import classnames from './utils.ts';

  let classes = '';
  let className = '';
  export { className as class };
  export let captionHeader = '';
  export let captionText = '';

  $: classes = classnames(
    className,
    'carousel-caption',
    'd-none',
    'd-md-block'
  );
</script>

<div {...$$restProps} class={classes}>
  {#if captionHeader}<h5>{captionHeader}</h5>{/if}
  {#if captionText}<p>{captionText}</p>{/if}
  <slot />
</div>
