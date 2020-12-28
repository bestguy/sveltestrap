<script>
  import classnames from './utils';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  let className = '';
  export { className as class };
  export let activeTab;

  const activeTabId = writable(activeTab);

  $: activeTabId.set(activeTab);

  setContext('tabContent', {
    activeTabId
  });

  $: classes = classnames('tab-content', className);
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
