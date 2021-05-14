![sveltestrap](./logo.svg)

## Bootstrap 5 components for Svelte v3

The philosophy of this library is to provide all Bootstrap 5 components for a [Svelte](https://svelte.dev) app, without needing to use Bootstrap component classes or needing to include Bootstrap's JavaScript.

However, to make using Bootstrap themes easier, this library does _not_ embed Bootstrap styles directly and you will need to include Bootstrap 5 CSS in your page.

**Note:** Bootstrap 4 CSS users must use Sveltestrap 4 - see docs here: <a href="https://sveltestrap.js.org/v4">Sveltestrap version 4</a>

The component names and interface are inspired by the [reactstrap](https://reactstrap.github.io) library for React.

[Demo page](https://sveltestrap.js.org/)

---

## Install

`npm install --save svelte sveltestrap`

## Usage

_You need to include a link to Bootstrap 5 stylesheet in your page - these components do not include or embed any Bootstrap styles automatically._

Either in your HTML layout:

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
  />
</head>
```

Or from your Svelte app, either:

```html
<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css">
</svelte:head>
```

or:

```html
<style>
  @import "https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css";
</style>
```

Then use sveltestrap components in your svelte component:

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

### Note on Icons

If you wish to use the [Icon component](https://sveltestrap.js.org/?path=/story/components--icon),
you also must include a link to Bootstrap Icon CSS, for example:

```html
<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css">
</svelte:head>
```

or:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
/>
```

This component uses and assumes the CSS based webfont.  You can host the icon CSS and webfonts on your own domain if needed.

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

if you prefer the 'sveltestrap' import, you can move the package to `devDependencies` block in your `package.json` so that sapper will parse the es bundle

```json
"devDependencies": {
    "sveltestrap": "*.*.*",
    ...
  },
```
