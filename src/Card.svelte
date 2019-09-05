<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let body = false;
  export let color = '';
  export let id = '';
  export let inverse = false;
  export let outline = false;
  export let style = '';

  const props = clean($$props);

  $: classes = clsx(
    className,
    'card',
    inverse ? 'text-white' : false,
    body ? 'card-body' : false,
    color ? `${outline ? 'border' : 'bg'}-${color}` : false
  );
</script>

<div {...props} {id} class="{classes}" on:click {style}>
  <slot />
</div>
