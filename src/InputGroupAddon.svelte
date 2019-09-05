<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  let className = '';
  export { className as class };
  export let addonType;

  const props = clean($$props);

  if (['prepend', 'append'].indexOf(addonType) === -1) {
    throw new Error(`addonType must be one of 'prepend', 'append'. Received '${addonType}' instead.`);
  }

  $: classes = clsx(
    className,
    `input-group-${addonType}`,
  );

</script>

<div {...props} class="{classes}">
  <slot/>
</div>
