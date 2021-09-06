<script>
  import { getContext, onMount } from 'svelte';
  import NavItem from './NavItem.svelte';
  import NavLink from './NavLink.svelte';
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let active = false;
  export let disabled = false;
  export let tab = undefined;
  export let tabId = undefined;

  const tabs = getContext('tabs');
  const { activeTabId, setActiveTab } = getContext('tabContent');

  onMount(() => {
    if (active) setActiveTab(tabId);
  });

  $: tabOpen = $activeTabId === tabId;
  $: classes = classnames('tab-pane', className, {
    active: tabOpen,
    show: tabOpen
  });
</script>

{#if tabs}
  <NavItem>
    <NavLink active={tabOpen} {disabled} on:click={() => setActiveTab(tabId)}>
      {#if tab}{tab}{/if}
      <slot name="tab" />
    </NavLink>
  </NavItem>
{:else}
  <div {...$$restProps} class={classes}>
    <slot />
  </div>
{/if}
