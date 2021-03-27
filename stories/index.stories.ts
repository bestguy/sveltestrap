import { storiesOf } from '@storybook/svelte';

import Accordion from './accordion/Index.svelte';
import Alert from './alert/Index.svelte';
import Badge from './badge/Index.svelte';
import Breadcrumbs from './breadcrumb/Index.svelte';
import Button from './button/Index.svelte';
import Card from './card/Index.svelte';
import Carousel from './carousel/Index.svelte';
import Collapse from './collapse/Index.svelte';
import Dropdown from './dropdown/Index.svelte';
import Fade from './fade/Index.svelte';
import Icon from './icon/Index.svelte';
import InputGroup from './inputgroup/Index.svelte';
import Inputs from './input/Index.svelte';
import ListGroup from './listgroup/Index.svelte';
import Modals from './modal/Index.svelte';
import Navbar from './navbar/Index.svelte';
import Offcanvas from './offcanvas/Index.svelte';
import Nav from './nav/Index.svelte';
import Grid from './layout/Index.svelte';
import Pagination from './pagination/Index.svelte';
import Popover from './popover/Index.svelte';
import Progress from './progress/Index.svelte';
import Spinner from './spinner/Index.svelte';
import Tables from './table/Index.svelte';
import Toast from './toast/Index.svelte';
import Tooltip from './tooltip/Index.svelte';
import Welcome from './welcome/Index.svelte';

const story = (Component) => () => ({
  Component
});

storiesOf('Components', module)
  .add('Get Started', story(Welcome))
  .add('Layout', story(Grid))
  .add('Accordion', story(Accordion))
  .add('Alert', story(Alert))
  .add('Badge', story(Badge))
  .add('Breadcrumb', story(Breadcrumbs))
  .add('Button', story(Button))
  .add('Card', story(Card))
  .add('Carousel', story(Carousel))
  .add('Collapse', story(Collapse))
  .add('Dropdown', story(Dropdown))
  .add('Fade', story(Fade))
  .add('Icon', story(Icon))
  .add('Inputs', story(Inputs))
  .add('InputGroup', story(InputGroup))
  .add('ListGroup', story(ListGroup))
  .add('Modals', story(Modals))
  .add('Nav', story(Nav))
  .add('Navbar', story(Navbar))
  .add('Offcanvas', story(Offcanvas))
  .add('Pagination', story(Pagination))
  .add('Popover', story(Popover))
  .add('Progress', story(Progress))
  .add('Spinner', story(Spinner))
  .add('Table', story(Tables))
  .add('Toast', story(Toast))
  .add('Tooltip', story(Tooltip));
