<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let top = false;
  export let bottom = false;
  export let src;
  export let alt = '';

  const props = clean($$props);

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
