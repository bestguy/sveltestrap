<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let noGutters = false;
  export let form = false;
  export let id = '';
  export let cols = 0;

  const props = clean($$props);

  $: classes = clsx(
    className,
    noGutters ? 'no-gutters' : null,
    form ? 'form-row' : 'row',
    cols > 0 ? `row-cols-${cols}` : null,
  );
</script>

<div {...props} {id} class="{classes}">
  <slot />
</div>
