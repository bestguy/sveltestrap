import { storiesOf } from '@storybook/svelte';

import Accordion from './accordion/Index.svelte';
import Alert from './alert/Index.svelte';
import Badge from './badge/Index.svelte';
import Breadcrumbs from './breadcrumb/Index.svelte';
import ButtonDropdown from './buttondropdown/Index.svelte';
import Button from './button/Index.svelte';
import Card from './card/Index.svelte';
import Carousel from './carousel/Index.svelte';
import Collapse from './collapse/Index.svelte';
import Dropdown from './dropdown/Index.svelte';
import Fade from './fade/Index.svelte';
import FormGroup from './formgroup/Index.svelte';
import Icon from './icon/Index.svelte';
import Image from './image/Index.svelte';
import InputGroup from './inputgroup/Index.svelte';
import Inputs from './input/Index.svelte';
import ListGroup from './listgroup/Index.svelte';
import Modals from './modal/Index.svelte';
import Navbar from './navbar/Index.svelte';
import Offcanvas from './offcanvas/Index.svelte';
import Nav from './nav/Index.svelte';
import Tab from './tab/Index.svelte';
import Container from './layout/Index.svelte';
import Grid from './layout/Grid.svelte';
import Pagination from './pagination/Index.svelte';
import Popover from './popover/Index.svelte';
import Progress from './progress/Index.svelte';
import Spinner from './spinner/Index.svelte';
import Styles from './styles/Index.svelte';
import Tables from './table/Index.svelte';
import Toast from './toast/Index.svelte';
import Tooltip from './tooltip/Index.svelte';
import Validation from './form/Index.svelte';
import Welcome from './welcome/Index.svelte';

const story = (Component) => () => ({
  Component
});

storiesOf('Getting started/Get Started', module).add('Get Started', story(Welcome));

storiesOf('Layout/Grid', module).add('Grid', story(Grid));
storiesOf('Layout/Container', module).add('Container', story(Container))

storiesOf('Content/Images', module).add('Images', story(Image))
storiesOf('Content/Tables', module).add('Tables', story(Tables));

storiesOf('Form/Inputs', module).add('Inputs', story(Inputs))
storiesOf('Form/InputGroup', module).add('InputGroup', story(InputGroup))
storiesOf('Form/FormGroup', module).add('FormGroup', story(FormGroup))
storiesOf('Form/Validation', module).add('Validation', story(Validation));

storiesOf('Components/Accordion', module).add('Accordion', story(Accordion))
storiesOf('Components/Alert', module).add('Alert', story(Alert))
storiesOf('Components/Badge', module).add('Badge', story(Badge))
storiesOf('Components/Breadcrumb', module).add('Breadcrumb', story(Breadcrumbs))
storiesOf('Components/Button', module).add('Button', story(Button))
storiesOf('Components/ButtonDropdown', module).add('ButtonDropdown', story(ButtonDropdown))
storiesOf('Components/Card', module).add('Card', story(Card))
storiesOf('Components/Carousel', module).add('Carousel', story(Carousel))
storiesOf('Components/Collapse', module).add('Collapse', story(Collapse))
storiesOf('Components/Dropdown', module).add('Dropdown', story(Dropdown))
storiesOf('Components/Fade', module).add('Fade', story(Fade))
storiesOf('Components/Icon', module).add('Icon', story(Icon))
storiesOf('Components/ListGroup', module).add('ListGroup', story(ListGroup))
storiesOf('Components/Modals', module).add('Modals', story(Modals))
storiesOf('Components/Nav', module).add('Nav', story(Nav))
storiesOf('Components/Navbar', module).add('Navbar', story(Navbar))
storiesOf('Components/Offcanvas', module).add('Offcanvas', story(Offcanvas))
storiesOf('Components/Pagination', module).add('Pagination', story(Pagination))
storiesOf('Components/Popover', module).add('Popover', story(Popover))
storiesOf('Components/Progress', module).add('Progress', story(Progress))
storiesOf('Components/Spinner', module).add('Spinner', story(Spinner))
storiesOf('Components/Styles', module).add('Styles', story(Styles))
storiesOf('Components/Tabs', module).add('Tabs', story(Tab))
storiesOf('Components/Toast', module).add('Toast', story(Toast))
storiesOf('Components/Tooltip', module).add('Tooltip', story(Tooltip));
