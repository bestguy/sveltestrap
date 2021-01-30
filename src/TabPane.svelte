<script>
  import { getContext } from 'svelte';
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let tabId;

  const { activeTabId } = getContext('tabContent');

  $: classes = classnames('tab-pane', className, {
    active: tabId === $activeTabId
  });
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
