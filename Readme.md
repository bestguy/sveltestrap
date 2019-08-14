![Logo](./logo.png)

## Bootstrap 4 components for Svelte v3

**Work in progress, check back soon - PRs are welcome!**

The philosophy of this library is to provide all Bootstrap 4 components for a [Svelte](https://svelte.dev) app, without needing to use Bootstrap component classes or needing to include Bootstrap's JavaScript.

However, to make using Bootstrap themes easier, this library does _not_ embed Bootstrap styles directly and you will need to include Bootstrap 4 CSS in your page.

The component names and interface are inspired by the [reactstrap](https://reactstrap.github.io) library for React.

[Demo page](https://bestguy.github.io/sveltestrap/)

### Status

* See component list below
  * Tooltip & Popover are not implemented yet due to lacking Popper/Tether support
  * Carousel not implemented yet, need to port transitions/state/key handlers.
* Some stateful components have issues
  * Collapse uses the Svelte slide transistion. In Svelte, the component is removed from the DOM whereas in Bootstrap, it stays in the DOM, but is hidden. This interacts badly with nav bars on small screens.
  * Modal uses Svelte fade transition, which does not use the Bootstrap theme defaults for duration, etc.

----

## Install

`npm install --save svelte sveltestrap`

## Usage

_You need to include a link to Bootstrap 4 stylesheet in your page - these components do not include or embed any Bootstrap styles automatically._

In your svelte component:

```html
<script>
  import { Button, Col, Row } from 'sveltestrap';
</script>

<Row>
  <Col>
    <Button color="primary" outline>Hello World!</Button>
  </Col>
<Row>
```

### Layout

* [x] Container
* [x] Col
* [x] Row

### Components

* [x] Alert
  * [x] UncontrolledAlert
* [x] Badge
* [x] Breadcrumb
  * [x] BreadcrumbItem
* [x] Button
  * [x] ButtonDropdown
  * [x] UncontrolledButtonDropdown
* [x] ButtonGroup
* [x] ButtonToolbar
* [x] Card
  * [x] CardBody
  * [x] CardColumns
  * [x] CardDeck
  * [x] CardFooter
  * [x] CardGroup
  * [x] CardHeader
  * [x] CardImg
  * [x] CardImgOverlay
  * [x] CardLink
  * [x] CardSubtitle
  * [x] CardText
  * [x] CardTitle
* [ ] Carousel
  * [ ] CarouselCaption
  * [ ] CarouselControl
  * [ ] CarouselIndicators
  * [ ] CarouselItem
* [x] Close
* [x] Collapse
  * [x] UncontrolledCollapse
* [x] Dropdown
  * [x] DropdownItem
  * [x] DropdownMenu
  * [x] DropdownToggle
  * [x] UncontrolledDropdown
* [x] Form
  * [x] FormFeedback
  * [x] FormGroup
  * [x] FormText
* [x] Input
  * [x] CustomInput
* [x] InputGroup
  * [x] InputGroupAddon
  * [x] InputGroupButtonDropdown
  * [x] InputGroupText
* [x] Jumbotron
* [x] Label
* [x] ListGroup
* [x] ListGroupItem
  * [x] ListGroupItemHeading
  * [x] ListGroupItemText
* [x] Media
  * [x] MediaBody
* [x] Modal
  * [x] ModalBody
  * [x] ModalFooter
  * [x] ModalHeader
* [x] Nav
  * [x] NavItem
  * [x] NavLink
* [x] Navbar
  * [x] NavbarBrand
  * [x] NavbarToggler
* [x] Pagination
  * [x] PaginationItem
  * [x] PaginationLink
* [ ] Popover
  * [ ] PopoverContent
  * [ ] PopoverTitle
* [x] Progress
* [x] Spinner
* [x] TabContent
* [x] TabPane
* [x] Table
* [x] Toast
  * [x] ToastBody
  * [x] ToastHeader
* [ ] Tooltip
