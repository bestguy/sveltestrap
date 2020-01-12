<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let classes = '';
  let className = '';
  export { className as class };
  export let id = '';
  export let captionHeader = '';
  export let captionText = '';

  const props = clean($$props);

  $: classes = clsx(className, 'carousel-caption', 'd-none', 'd-md-block');
</script>

<div {...props} {id} class={classes}>
  <h5>{captionHeader}</h5>
  <p>{captionText}</p>
  <slot />
</div>
