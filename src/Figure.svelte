<script>
  import { setContext } from 'svelte';
  import classnames from './utils.ts';

  setContext('figure', true);

  let className = '';
  export { className as class };
  export let alt = undefined;
  export let caption = undefined;

  $: classes = classnames('figure', className);
</script>

<img {alt} {...$$restProps} class={classes} />

<figure class={classes} {...$$restProps}>
  <slot />
  {#if caption || $$slots.caption}
    <figcaption class="figure-caption">
      {caption}<slot name="caption" />
    </figcaption>
  {/if}
</figure>
