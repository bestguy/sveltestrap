<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import FadeExample from '../examples/Fade';
	const FadeExampleSource = require('!!raw-loader!../examples/Fade').default;

	import UncontrolledFadeExample from '../examples/FadeUncontrolled';
	const UncontrolledFadeExampleSource = require('!!raw-loader!../examples/FadeUncontrolled').default;

	import FadeEventsExample from '../examples/FadeEvents';
	const FadeEventsExampleSource = require('!!raw-loader!../examples/FadeEvents').default;
</script>

<PageTitle title="Fade" />
<div class="docs-example">
	<FadeExample />
</div>
<pre>
	<PrismCode class="language-html">{FadeExampleSource}</PrismCode>
</pre>

<SectionTitle>Events</SectionTitle>
<p>
	Use the <code>on:enter</code>, onEntering, onEntered, onExiting and onExited props for
	callbacks when the Fade has finished opening (entering) or closing (exiting).
</p>
<div class="docs-example">
	<FadeEventsExample />
</div>
<pre>
	<PrismCode class="language-html">{FadeEventsExampleSource}</PrismCode>
</pre>
<SectionTitle>Uncontrolled Fade</SectionTitle>
<p>
	For the most basic use-case, an uncontrolled component can provide the functionality
	wanted without the need to manage/control the state of the component.{' '}
	<code>UncontrolledFade</code> does not require an <code>isOpen</code> prop. Instead
	pass a <code>toggler</code> prop. The <code>toggler</code> prop is a string which will run
	querySelectorAll to find dom elements which will trigger toggle.
</p>

<div class="docs-example">
	<UncontrolledFadeExample />
</div>
<pre>
	<PrismCode class="language-html">{UncontrolledFadeExampleSource}</PrismCode>
</pre>
