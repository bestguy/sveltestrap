# Code Notes

This pattern is used to allow testing of Svelte slots:

```
{#if children}
  {children}
{:else}
  <slot />
{/if}
```

Svelte componenent constructors do not support slots, so this adds a fake 'children' prop to allow.  More info here:
https://github.com/testing-library/svelte-testing-library/issues/48