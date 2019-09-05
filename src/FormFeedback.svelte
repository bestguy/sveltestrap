<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let valid = undefined;
  export let tooltip = false;
  let classes;

  const props = clean($$props);

  $: {
    const validMode = tooltip ? 'tooltip' : 'feedback';

    classes = clsx(
      className,
      valid ? `valid-${validMode}` : `invalid-${validMode}`,
    );
  }
</script>

<div class="{classes}" {...props}>
  <slot />
</div>
