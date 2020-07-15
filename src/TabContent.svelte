<script>
  import clsx from 'clsx';
  import { context } from './TabContext';

  let className = '';
  export { className as class };
  export let activeTab;


  $: classes = clsx('tab-content', className);

  $: context.update(() => {
    return {
      activeTabId: activeTab
    };
  });
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
