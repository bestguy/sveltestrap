<script lang="ts">
  import Example from '../Example.svelte';
  import Backdrop from './Backdrop.svelte';
  import backdropSource from '!!raw-loader!./Backdrop.svelte';
  import Events from './Events.svelte';
  import eventsSource from '!!raw-loader!./Events.svelte';
  import External from './External.svelte';
  import externalSource from '!!raw-loader!./External.svelte';
  import Fade from './Fade.svelte';
  import fadeSource from '!!raw-loader!./Fade.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
  import Fullscreen from './Fullscreen.svelte';
  import fullscreenSource from '!!raw-loader!./Fullscreen.svelte';
  import Scrolling from './Scrolling.svelte';
  import scrollingSource from '!!raw-loader!./Scrolling.svelte';
  import Sizes from './Sizes.svelte';
  import sizesSource from '!!raw-loader!./Sizes.svelte';
  import Shorthand from './Shorthand.svelte';
  import shorthandSource from '!!raw-loader!./Shorthand.svelte';
  import Static from './Static.svelte';
  import staticSource from '!!raw-loader!./Static.svelte';
  import StaticBackdrop from './StaticBackdrop.svelte';
  import staticBackdropSource from '!!raw-loader!./StaticBackdrop.svelte';
</script>

<h1>Modals</h1>
<a href="https://getbootstrap.com/docs/5.0/components/modal/" target="_blank">
  Bootstrap Modals
</a>

<Example source={sampleSource}>
  <Sample />
</Example>

<Example title="Shorthand" source={shorthandSource}>
  <p slot="info">
    The <code>body</code> and <code>header</code> props let you create simple
    Modals without needing to add <code>ModalHeader</code> and
    <code>ModalBody</code>.
  </p>
  <Shorthand />
</Example>

<Example title="Sizes" source={sizesSource}>
  <Sizes />
</Example>

<Example title="Fullscreen" source={fullscreenSource}>
  <Fullscreen />
</Example>

<Example title="Scrolling" source={scrollingSource}>
  <Scrolling />
</Example>

<Example title="Backdrop" source={backdropSource}>
  <Backdrop />
</Example>

<Example title="Static Backdrop" source={staticBackdropSource}>
  <StaticBackdrop />
</Example>

<Example title="Fade" source={fadeSource}>
  <Fade />
</Example>

<Example title="Events" source={eventsSource}>
  <Events />
</Example>

<Example title="Static" source={staticSource}>
  <Static />
</Example>

<Example title="External Content" source={externalSource}>
  <External />
</Example>
