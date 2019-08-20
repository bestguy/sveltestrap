<script>
  import clsx from 'clsx';
  import { context } from './TabContext';

  let className = '';
  export { className as class };
  export let activeTab;
  export let tabId;

  let { children: _children, ...props } = $$props;

  $: classes = clsx(
    'tab-pane',
    className,
    {
      active: tabId === $context.activeTabId,
    },
  );
</script>

<div {...props} class="{classes}">
  <slot />
</div>
