<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import ListGroupExample from '../examples/ListGroup';
	const ListGroupExampleSource = require('!!raw-loader!../examples/ListGroup').default;

	import ListGroupBadgeExample from '../examples/ListGroupBadge';
	const ListGroupBadgeExampleSource = require('!!raw-loader!../examples/ListGroupBadge').default;

	import ListGroupDisabledItemsExample from '../examples/ListGroupDisabledItems';
	const ListGroupDisabledItemsExampleSource = require('!!raw-loader!../examples/ListGroupDisabledItems').default;

	import ListGroupAnchorsAndButtonsExample from '../examples/ListGroupAnchorsAndButtons';
	const ListGroupAnchorsAndButtonsExampleSource = require('!!raw-loader!../examples/ListGroupAnchorsAndButtons').default;

	import ListGroupContextualClassesExample from '../examples/ListGroupContextualClasses';
	const ListGroupContextualClassesExampleSource = require('!!raw-loader!../examples/ListGroupContextualClasses').default;

	import ListGroupCustomContentExample from '../examples/ListGroupCustomContent';
	const ListGroupCustomContentExampleSource = require('!!raw-loader!../examples/ListGroupCustomContent').default;

	import ListGroupFlushExample from '../examples/ListGroupFlush';
	const ListGroupFlushExampleSource = require('!!raw-loader!../examples/ListGroupFlush')

</script>

<PageTitle title="ListGroup" />
<div class="docs-example">
	<ListGroupExample />
</div>
<pre>
	<PrismCode class="language-html">
		{ListGroupExampleSource}
	</PrismCode>
</pre>

<legend>Tags</legend>
<div class="docs-example">
	<ListGroupBadgeExample />
</div>
<pre>
	<PrismCode class="language-html">
		{ListGroupBadgeExampleSource}
	</PrismCode>
</pre>

<legend>Disabled items</legend>
<div class="docs-example">
	<ListGroupDisabledItemsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{ListGroupDisabledItemsExampleSource}
	</PrismCode>
</pre>

<legend>Anchors and buttons</legend>
<div class="docs-example">
	<p>Note: you need add action props to make these buttons fit the list.</p>
	<ListGroupAnchorsAndButtonsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{ListGroupAnchorsAndButtonsExampleSource}
	</PrismCode>
</pre>

<legend>Contextual classes</legend>
<div class="docs-example">
	<ListGroupContextualClassesExample />
</div>
<pre>
	<PrismCode class="language-html">
		{ListGroupContextualClassesExampleSource}
	</PrismCode>
</pre>

<legend>Custom content</legend>
<div class="docs-example">
	<ListGroupCustomContentExample />
</div>
<pre>
	<PrismCode class="language-html">
		{ListGroupCustomContentExampleSource}
	</PrismCode>
</pre>

<legend>Flush</legend>
<div class="docs-example">
	<ListGroupFlushExample />
</div>
<pre>
	<PrismCode class="language-html">
		{ListGroupFlushExampleSource}
	</PrismCode>
</pre>
