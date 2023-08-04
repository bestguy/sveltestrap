<script lang="ts">
  import { Button } from 'sveltestrap';
  import { linkTo } from '@storybook/addon-links';
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Theme from './Theme.svelte';
  import themeSource from '!!raw-loader!./Theme.svelte';
</script>

<h1>Styles</h1>

<Example source={sampleSource}>
  <p slot="info">
    The Styles component is not required, but is a convenient way to include the
    CDN Bootstrap 5 styles needed for Sveltestrap if you don't already include
    Bootstrap styles. If you don't want to include Bootstrap's icons styles
    needed for the <Button
      color="link"
      class="p-0"
      style="vertical-align: unset;"
      on:click={linkTo('Components', 'Icon')}>Icon</Button
    > component, you can set
    <code> &lt;Styles icons=&lbrace;false&rbrace; /&gt; </code>
  </p>
  <Sample />
</Example>

<Example title="Theme" source={themeSource}>
  <p slot="info">
    The optional theme attribute allows you set the color mode for the included
    styles. The 'light' and 'dark' values explicitly sets the theme, and 'auto'
    matches the user's system preference. When not specified, the default theme
    is light. See Bootstrap's
    <a
      href="https://getbootstrap.com/docs/5.3/customize/color-modes/"
      rel="noreferrer"
      target="_blank"
    >
      Color Modes
    </a>
    for more information.
  </p>
  <Theme />
</Example>
