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
* [ ] Media
* [ ] Modal
  * [ ] ModalBody
  * [x] ModalFooter
  * [ ] ModalHeader
* [ ] Nav
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
* [ ] Table
* [ ] Tooltip
