import { storiesOf } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';

import Alert from './Alert.svelte';
import Badge from './Badge.svelte';
import Breadcrumbs from './Breadcrumbs.svelte';
import Button from './Button.svelte';
import ButtonDropdown from './ButtonDropdown.svelte';
import ButtonGroup from './ButtonGroup.svelte';
import Buttons from './Buttons.svelte';
import Card from './Card.svelte';
import Carousel from './Carousel.svelte';
import Collapse from './Collapse.svelte';
import CustomInputs from './CustomInputs.svelte';
import Dropdowns from './Dropdowns.svelte';
import Fade from './Fade.svelte';
import Form from './Form.svelte';
import InputGroup from './InputGroup.svelte';
import Inputs from './Inputs.svelte';
import Jumbotron from './Jumbotron.svelte';
import Layout from './Layout.svelte';
import ListGroup from './ListGroup.svelte';
import Media from './Media.svelte';
import Modals from './Modals.svelte';
import Navbar from './Navbar.svelte';
import Navs from './Navs.svelte';
import Pagination from './Pagination.svelte';
import Popovers from './Popovers.svelte';
import Progress from './Progress.svelte';
import Spinner from './Spinner.svelte';
import Tables from './Tables.svelte';
import Tabs from './Tabs.svelte';
import Toasts from './Toasts.svelte';

import spinnerSource from '!!raw-loader!./Spinner.svelte';

import { buttonColors, colors } from './colors';

const story = Component => () => ({
  Component
});

storiesOf('Layout', module)
  .add('default', story(Layout));

storiesOf('Alert', module)
  .add('default', () => ({
    Component: Alert,
    props: {
      color: select('color', colors),
      source: spinnerSource
    },
  }));

storiesOf('Badge', module)
  .add('default', story(Badge));

  storiesOf('Breadcrumbs', module)
  .add('default', story(Breadcrumbs));

storiesOf('Button', module)
  .add('default', () => ({
    Component: Buttons,
    on: {
      click: action('clicked')
    }
  }))
  .add('Live Example', () => ({
    Component: Button,
    props: {
      block: boolean('block'),
      disabled: boolean('disabled'),
      color: select('color', buttonColors),
      size: select('size', ['', 'sm', 'lg']),
      text: text('text', 'Hello World!')
    },
    on: {
      click: action('clicked')
    }
  }));

storiesOf('Card', module)
  .add('default', story(Card));

storiesOf('Collapse', module)
  .add('default', story(Collapse));

storiesOf('Fade', module)
  .add('default', story(Fade));

storiesOf('Form', module)
  .add('default', story(Form))
  .add('Inputs', story(Inputs))
  .add('CustomInputs', story(CustomInputs));

storiesOf('InputGroup', module)
  .add('default', story(InputGroup));

storiesOf('ListGroup', module)
  .add('default', story(ListGroup));

storiesOf('Navbar', module)
  .add('default', () => ({
    Component: Navbar,
    props: {
      color: select('color', colors, 'dark'),
      light: boolean('light'),
      dark: boolean('dark'),
      expand: select('expand', ['', 'sm', 'md', 'lg']),
      fixed: select('fixed', ['', 'top', 'bottom'])
    }
  }));

storiesOf('Modals', module)
  .add('default', story(Modals));

storiesOf('Progress', module)
  .add('default', story(Progress));

storiesOf('Table', module)
  .add('default', story(Tables));

storiesOf('Toasts', module)
  .add('default', story(Toasts));

storiesOf('Spinner', module)
  .add('default', () => ({
    Component: Spinner,
    props: {
      color: select('color', colors),
      size: select('size', ['', 'sm', 'lg']),
      type: select('type', ['border', 'grow'], 'border')
    },
  }));
