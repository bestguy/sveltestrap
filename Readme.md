![Logo](./logo.png)

## Bootstrap 4 components for Svelte

**Work in progress, check back soon - PRs are welcome!**

----

## Install

`npm install sveltestrap`

## Usage

_You need to include a link to Bootstrap 4 stylesheet in your page - these components do not include or embed any Bootstrap styles automatically._

In your svelte component:

```html
<Row>
  <Col>
    <Button color="primary" outline>Hello World!</Button>
  </Col>
<Row>

<script>
  import { Button, Col, Row } from 'sveltestrap';

  export default {
    components: {
      Button,
      Col,
      Row
    }
  }
</script>
```

## Status


### Layout

* [x] Container
* [x] Col
* [x] Row

### Components

* [ ] Alerts
* [x] Badge
* [ ] Breadcrumb
* [x] Button
* [x] ButtonGroup
* [x] ButtonToolbar
* [ ] Card
* [ ] Carousel
* [ ] Collapse
* [ ] Dropdowns
* [ ] Forms
* [x] Icon (_FontAwesome helper_)
* [ ] Input group
* [ ] Jumbotron
* [x] ListGroup
* [x] ListGroupItem
* [ ] Modal
* [ ] Navs
* [ ] Navbar
* [ ] Pagination
* [ ] Popovers
* [ ] Progress
* [ ] Scrollspy
* [ ] Tooltips
