<script>
  import clsx from 'clsx';
  import { context } from './TabContext';

  let className = '';
  export { className as class };
  export let tabId;


  $: classes = clsx('tab-pane', className, {
    active: tabId === $context.activeTabId
  });
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
