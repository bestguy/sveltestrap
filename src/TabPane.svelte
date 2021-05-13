<script>
  import { getContext } from 'svelte';
  import NavItem from './NavItem.svelte';
  import NavLink from './NavLink.svelte';
  import classnames from './utils';

  let className = '';
  export { className as class };
  // export let active = false; //TODO initial?
  export let tab = undefined;
  export let tabId = undefined;

  const tabs = getContext('tabs');
  const { activeTabId, setActiveTab } = getContext('tabContent');

  $: classes = classnames('tab-pane fadeN', className, {
    active,
    show: active
  });
  $: active = $activeTabId === tabId;
</script>

{#if tabs}
  <NavItem>
    <NavLink
      {active}
      on:click={() => setActiveTab(tabId)}>
      {#if tab}{tab}{/if}
      <slot name="tab" />
    </NavLink>
  </NavItem>
{:else}
  <div {...$$restProps} class={classes}>
    <slot />
  </div>
{/if}
