<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import ProgressExample from '../examples/Progress';
	const ProgressExampleSource = require('!!raw-loader!../examples/Progress').default;

	import ProgressColorExample from '../examples/ProgressColor';
	const ProgressColorExampleSource = require('!!raw-loader!../examples/ProgressColor').default;

	import ProgressLabelsExample from '../examples/ProgressLabels';
	const ProgressLabelsExampleSource = require('!!raw-loader!../examples/ProgressLabels').default;

	import ProgressAnimatedExample from '../examples/ProgressAnimated';
	const ProgressAnimatedExampleSource = require('!!raw-loader!../examples/ProgressAnimated').default;

	import ProgressStripedExample from '../examples/ProgressStriped';
	const ProgressStripedExampleSource = require('!!raw-loader!../examples/ProgressStriped').default;

	import ProgressMultiExample from '../examples/ProgressMulti';
	const ProgressMultiExampleSource = require('!!raw-loader!../examples/ProgressMulti').default;

	import ProgressMaxExample from '../examples/ProgressMax';
	const ProgressMaxExampleSource = require('!!raw-loader!../examples/ProgressMax').default;
</script>

<PageTitle title="Progress" />
<div class="docs-example">
	<ProgressExample />
</div>
<pre>
	<PrismCode class="language-html">
		{ProgressExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Color Variants</SectionTitle>
<div class="docs-example">
	<div>
		<ProgressColorExample />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
		{ProgressColorExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Labels</SectionTitle>
<div class="docs-example">
	<div>
		<ProgressLabelsExample />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
		{ProgressLabelsExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Striped</SectionTitle>
<div class="docs-example">
	<div>
		<ProgressStripedExample />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
		{ProgressStripedExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Animated</SectionTitle>
<p>
	The <code>animated</code> prop also adds the <code>striped</code> prop; there is no need to pass both.
</p>
<div class="docs-example">
	<div>
		<ProgressAnimatedExample />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
		{ProgressAnimatedExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Multiple bars / Stacked</SectionTitle>
<div class="docs-example">
	<div>
		<ProgressMultiExample />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
		{ProgressMultiExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Max value</SectionTitle>
<div class="docs-example">
	<div>
		<ProgressMaxExample />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
		{ProgressMaxExampleSource}
	</PrismCode>
</pre>
