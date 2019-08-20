# Code Notes

This pattern is used for omitting props from spread props:

```javascript
let { children: _children, ...props } = $$props;
```
`children: _children` just renames `children` so that there is no conflict later in code.  The remaining props are then spread to component:

```html
<div {...props} class="{classes}">
```

----

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