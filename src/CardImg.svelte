<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let top = false;
  export let bottom = false;
  export let src;
  export let alt = '';

  let { children: _children, ...props } = $$props;

  let classes = '';
  $: {
    let cardImgClassName = 'card-img';
    if (top) {
      cardImgClassName = 'card-img-top';
    }
    if (bottom) {
      cardImgClassName = 'card-img-bottom';
    }
    classes = clsx(
      className,
      cardImgClassName,
    );
  }
</script>

<img {...props} class="{classes}" {src} {alt} />
