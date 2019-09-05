<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let inline = false;
  export let color = 'muted';

  const props = clean($$props);

  $: classes = clsx(
    className,
    !inline ? 'form-text' : false,
    color ? `text-${color}` : false
  );
</script>

<small class="{classes}" {...props}>
  <slot/>
</small>
