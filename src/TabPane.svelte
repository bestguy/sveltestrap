<script lang="typescript">
  import classnames from './utils';
  import { context } from './TabContext';

  let className = '';
  export { className as class };
  export let tabId;

  $: classes = classnames('tab-pane', className, {
    active: tabId === $context.activeTabId
  });
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
