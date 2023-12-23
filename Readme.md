![sveltestrap](./logo.svg)

# Important Note: This project is now hosted at [https://github.com/sveltestrap/sveltestrap](https://github.com/sveltestrap/sveltestrap)

## This repo is the legacy repo for Sveltestrap 5 for use with Svelte 3.  No new development will happen here.

sveltestrap.js.org docs now point to @sveltestrap/sveltestrap v6, and the new install/import for sveltestrap v6+ is `npm install @sveltestrap/sveltestrap`
(You can still use sveltestrap v5.x via `npm install sveltestrap`)

We were unable to migrate this repo to the sponsor's org, so please update your imports, stars, bookmarks, etc to https://github.com/sveltestrap/sveltestrap.  Our apologies for any confusion.
This repo will eventually be archived.


---

## Bootstrap 5 components for Svelte v3

The goal of this library is to provide all Bootstrap 5 components for a [Svelte](https://svelte.dev) app. Sveltestrap makes it easy to use Bootstrap since there is no need to use Bootstrap component classes, to include Bootstrap's JavaScript, nor depend on jQuery. Sveltestrap is free, open-source software published under the permissive [MIT license.](https://github.com/bestguy/sveltestrap/blob/master/LICENSE) This library was inspired by the [reactstrap](https://reactstrap.github.io) library for React.

To make using Bootstrap themes easier, this library does _not_ embed Bootstrap styles directly and you will need to include Bootstrap 5 CSS in your page.

[Demo page](https://sveltestrap.js.org/)

---

## Install

`npm install svelte sveltestrap`

## Usage

_You need to include a link to Bootstrap 5 stylesheet in your page - these components do not include or embed any Bootstrap styles automatically._

Either in your HTML layout:

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  />
</head>
```

Or from your Svelte app, either:

```html
<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</svelte:head>
```

or:

```html
<style>
  @import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
</style>
```

or alternately, use the [Styles](https://sveltestrap.js.org/?path=/story/components--styles) component:

```html
<script>
  import { Styles } from 'sveltestrap';
</script>

<Styles />
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
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
</svelte:head>
```

or:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
/>
```

or the [Styles](https://sveltestrap.js.org/?path=/story/components--styles) component includes the Bootstrap Icon CSS by default:

```html
<script>
  import { Styles } from 'sveltestrap';
</script>
<Styles />
```

### Note on usage with Sapper

If you are using Sveltestrap with Sapper, it's recommended you import the component source directly.
Note that this issue does not affect SvelteKit. For example:

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
