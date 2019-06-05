<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import CollapseExample from '../examples/Collapse';
	const CollapseExampleSource = require('!!raw-loader!../examples/Collapse').default;

	import UncontrolledCollapseExample from '../examples/CollapseUncontrolled';
	const CollapseEventsExampleSource = require('!!raw-loader!../examples/CollapseEvents').default;

	import CollapseEventsExample from '../examples/CollapseEvents';
	const UncontrolledCollapseExampleSource = require('!!raw-loader!../examples/CollapseUncontrolled').default;
</script>

<PageTitle title="Collapse" />
<div class="docs-example">
	<CollapseExample />
</div>
<pre>
	<PrismCode class="language-html">{CollapseExampleSource}</PrismCode>
</pre>

<SectionTitle>Events</SectionTitle>
<p>
	Use the <code>on:enter</code>, onEntering, onEntered, onExiting and onExited props for
	callbacks when the Collapse has finished opening (entering) or closing (exiting).
</p>
<div class="docs-example">
	<CollapseEventsExample />
</div>
<pre>
	<PrismCode class="language-html">{CollapseEventsExampleSource}</PrismCode>
</pre>
<SectionTitle>Uncontrolled Collapse</SectionTitle>
<p>
	For the most basic use-case, an uncontrolled component can provide the functionality
	wanted without the need to manage/control the state of the component.{' '}
	<code>UncontrolledCollapse</code> does not require an <code>isOpen</code> prop. Instead
	pass a <code>toggler</code> prop. The <code>toggler</code> prop is a string which will run
	querySelectorAll to find dom elements which will trigger toggle.
</p>
<div class="docs-example">
	<UncontrolledCollapseExample />
</div>
<pre>
	<PrismCode class="language-html">{UncontrolledCollapseExampleSource}</PrismCode>
</pre>
