<script>
  import { createEventDispatcher, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import classnames from './utils';
  import TabHeader from './TabHeader.svelte';

  const dispatch = createEventDispatcher();

  let className = '';
  export { className as class };
  export let activeTab;
  // export let fade = false; // TODO
  export let pills = false;
  export let vertical = false;

  const activeTabId = writable(activeTab);

  $: activeTabId.set(activeTab);

  setContext('tabContent', {
    activeTabId,
    setActiveTab: (tabId) => {
      activeTabId.set(tabId);
      dispatch('tab', tabId);
    }
  });

  $: classes = classnames('tab-content', className, {
    'd-flex align-items-start': vertical
  });
</script>

<div {...$$restProps} class={classes}>
  <TabHeader
    class={classnames({ 'me-3': vertical })}
    {pills}
    tabs={!pills}
    {vertical}>
    <slot />
  </TabHeader>
  <slot />
</div>
