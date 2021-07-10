<script>
  import { getContext } from 'svelte';
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let alt = undefined;
  export let figure = getContext('figure');
  export let fluid = false;
  export let thumbnail = false;

  $: classes = classnames(className, {
    'figure-img': figure,
    'img-fluid': fluid,
    'img-thumbnail': thumbnail
  });
</script>

<img {alt} {...$$restProps} class={classes} />
