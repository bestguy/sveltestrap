<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export {className as class};
  export let body = false;
  export let bottom = false;
  export let heading = false;
  export let left = false;
  export let list = false;
  export let middle = false;
  export let object = false;
  export let right = false;
  export let top = false;
  export let href = '';
  export let src = '';
  export let alt = '';

  const props = clean($$props);

  $: classes = clsx(
    className,
    {
      'media-body': body,
      'media-heading': heading,
      'media-left': left,
      'media-right': right,
      'media-top': top,
      'media-bottom': bottom,
      'media-middle': middle,
      'media-object': object,
      'media-list': list,
      media: !body && !heading && !left && !right && !top && !bottom && !middle && !object && !list,
    }
  );
</script>

{#if heading}
  <h4 {...props} class="{classes}">
    <slot/>
  </h4>
{:else if href}
  <a {...props} class="{classes}" {href}>
    <slot/>
  </a>
{:else if src || object}
  <img {...props} class="{classes}" {src} {alt} />
{:else if list}
  <ul {...props} class="{classes}">
    <slot/>
  </ul>
{:else}
  <div {...props} class="{classes}">
    <slot/>
  </div>
{/if}
