# sveltestrap

![Logo](./logo.svg)

## Bootstrap 4 components for Svelte v3

**Work in progress, check back soon - PRs are welcome!**

The philosophy of this library is to provide all Bootstrap 4 components for a [Svelte](https://svelte.dev) app, without needing to use Bootstrap component classes or needing to include Bootstrap's JavaScript.

However, to make using Bootstrap themes easier, this library does _not_ embed Bootstrap styles directly and you will need to include Bootstrap 4 CSS in your page.

The component names and interface are inspired by the [reactstrap](https://reactstrap.github.io) library for React.

[Demo page](https://sveltestrap.js.org/)

### Status

- See component list below
  - Tooltip & Popover are not implemented yet due to lacking Popper/Tether support [#31](https://github.com/bestguy/sveltestrap/issues/31), [#32](https://github.com/bestguy/sveltestrap/issues/32)
  - Carousel not implemented yet, need to port transitions/state/key handlers. [#30](https://github.com/bestguy/sveltestrap/issues/30)
- Some stateful components have issues
  - Collapse uses the Svelte slide transistion. In Svelte, the component is removed from the DOM whereas in Bootstrap, it stays in the DOM, but is hidden. This interacts badly with nav bars on small screens.
  - Modal uses Svelte fade transition, which does not use the Bootstrap theme defaults for duration, etc.
- Most components are missing general DOM events, see [#36](https://github.com/bestguy/sveltestrap/issues/36)

---

## Install

`npm install --save svelte sveltestrap`

## Usage

_You need to include a link to Bootstrap 4 stylesheet in your page - these components do not include or embed any Bootstrap styles automatically._

Either in your HTML layout:

```html
<head>
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
  />
</head>
```

Or add from your Svelte app:

```html
<svelte:head>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</svelte:head>
```

In your svelte component:

```html
<script>
  import { Button, Col, Row } from 'sveltestrap';
</script>

<Row>
  <Col>
    <Button color="primary" outline>Hello World!</Button>
  </Col>
</Row>
```

### Note on server-side rendering (SSR) Usage

If you are using Sveltestrap in an SSR environment like Sapper,
it's recommended you import the component source directly, for example:

```html
<script>
  import { Button, Col, Row } from 'sveltestrap/src';
</script>

<Row>
  <Col>
    <Button color="primary" outline>Hello World!</Button>
  </Col>
</Row>
```

if you prefer the 'sveltestrap' import, you can move the package to DevDependencies so that sapper will parse the es bundle

```json
"devDependencies": {
    "sveltestrap": "*.*.*",
    ...
  },
```

### Component status

Sveltestrap is currently missing support for the following components:

- [ ] Popover
  - [ ] PopoverContent
  - [ ] PopoverTitle
- [ ] Tooltip

Please follow (or help out with) these issues for status:

[Missing Tooltip (#31)](https://github.com/bestguy/sveltestrap/issues/31)

[Missing Popover (#32)](https://github.com/bestguy/sveltestrap/issues/32)
