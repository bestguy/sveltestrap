<script>
  import clsx from 'clsx';
  import { context } from './TabContext';

  let className = '';
  export { className as class };
  export let activeTab;

  let { children: _children, ...props } = $$props;

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
