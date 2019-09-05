<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let noGutters = false;
  export let form = false;
  export let id = '';

  const props = clean($$props);

  $: classes = clsx(
    className,
    noGutters ? 'no-gutters' : null,
    form ? 'form-row' : 'row',
  );
</script>

<div {...props} {id} class="{classes}">
  <slot />
</div>
