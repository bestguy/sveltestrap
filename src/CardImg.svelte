<script lang="typescript">
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let top = false;
  export let bottom = false;
  export let src;
  export let alt = '';

  let classes = '';
  $: {
    let cardImgClassName = 'card-img';
    if (top) {
      cardImgClassName = 'card-img-top';
    }
    if (bottom) {
      cardImgClassName = 'card-img-bottom';
    }
    classes = classnames(className, cardImgClassName);
  }
</script>

<img {...$$restProps} class={classes} {src} {alt} />
