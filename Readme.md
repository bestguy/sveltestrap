![Logo](./logo.png)

## Bootstrap 4 components for Svelte

**Work in progress, check back soon - PRs are welcome!**

The philosophy of this library is to provide all Bootstrap 4 components for a [Svelte](https://svelte.technology) app, without needing to use Bootstrap component classes or needing to include Bootstrap's JavaScript.

However, to make using Bootstrap themes easier, this library does _not_ embed Bootstrap styles directly and you will need to include Bootstrap 4 CSS in your page.

The component names and interface are inspired by the [reactstrap](https://reactstrap.github.io) library for React.

[Demo page](https://bestguy.github.io/sveltestrap/)

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

* [x] Most simple, stateless components are visually done (see below).
* [ ] Event handlers (on:click, etc), common optional attributes (id, href, data-, etc) are not applied to components! Ay!
* [ ] Add stateful components and those that depend on tethering (e.g. Alerts, Dropdown, Modals, Popovers, Tooltips).  

### Layout

* [x] Container
* [x] Col
* [x] Row

### Components

* [ ] Alert
* [x] Badge
* [x] Breadcrumb
  * [x] BreadcrumbItem
* [x] Button
  * [ ] ButtonDropdown
* [x] ButtonGroup
* [x] ButtonToolbar
* [x] Card
  * [x] CardBlock
  * [x] CardColumns
  * [x] CardDeck
  * [x] CardFooter
  * [x] CardGroup
  * [x] CardHeader
  * [ ] CardImg
  * [x] CardImgOverlay
  * [ ] CardLink
  * [x] CardSubtitle
  * [x] CardText
  * [x] CardTitle
* [x] Close
* [ ] Collapse
* [ ] Dropdown
  * [ ] DropdownItem
  * [ ] DropdownMenu
  * [ ] DropdownToggle
* [x] Form
  * [x] FormFeedback
  * [x] FormGroup
  * [x] FormText
* [x] Icon (_FontAwesome helper_)
* [ ] Input
* [x] InputGroup
  * [x] InputGroupAddon
  * [ ] InputGroupButton
* [x] Jumbotron
* [ ] Label
* [x] ListGroup
* [x] ListGroupItem
  * [x] ListGroupItemHeading
  * [x] ListGroupItemText
* [x] Media
  * [x] MediaBody
* [ ] Modal
  * [ ] ModalBody
  * [x] ModalFooter
  * [ ] ModalHeader
* [x] Nav
  * [x] NavDropdown
  * [x] NavItem
  * [ ] NavLink
* [ ] Navbar
  * [x] NavbarBrand
  * [ ] NavbarToggler
* [x] Pagination
  * [x] PaginationItem
  * [x] PaginationLink
* [ ] Popover
  * [ ] PopoverContent
  * [ ] PopoverTitle
* [x] Progress
* [ ] TabContent
* [ ] TabPane
* [x] Table
* [ ] Tooltip
