<script>
  import clsx from 'clsx';
  import { clean } from './utils';
  import { context } from './TabContext';

  let className = '';
  export { className as class };
  export let activeTab;

  const props = clean($$props);

  $: classes = clsx(
    'tab-content',
    className,
  );

  $: context.update(() => {
    return {
      activeTabId: activeTab,
    };
  });
</script>

<div {...props} class="{classes}">
  <slot />
</div>
