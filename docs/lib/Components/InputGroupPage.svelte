<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import OverviewExample from '../examples/InputGroupOverview';
	const OverviewExampleSource = require('!!raw-loader!../examples/InputGroupOverview').default;

	import AddonExample from '../examples/InputGroupAddon';
	const AddonExampleSource = require('!!raw-loader!../examples/InputGroupAddon').default;

	import AddonSizingExample from '../examples/InputGroupSizing';
	const AddonSizingExampleSource = require('!!raw-loader!../examples/InputGroupSizing').default;

	import ButtonExample from '../examples/InputGroupButton';
	const ButtonExampleSource = require('!!raw-loader!../examples/InputGroupButton').default;

</script>

<PageTitle title="Input Group" />
<p>
	Unlike in Reactstrap, all addon content <strong>must</strong> be wrapped, usually with <code>InputGroupText</code>.
</p>
<div class="docs-example">
	<OverviewExample />
</div>
<pre>
	<PrismCode class="language-html">
		{OverviewExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Addons</SectionTitle>
<div class="docs-example">
	<div>
		<AddonExample />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
		{AddonExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Addon Sizing</SectionTitle>
<div class="docs-example">
	<div>
		<AddonSizingExample />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
		{AddonSizingExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Buttons / Dropdowns</SectionTitle>
<p>
	Because dropdowns aren't fully working yet, these examples don't fully work.
</p>
<div class="docs-example">
	<div>
		<ButtonExample />
	</div>
</div>
<pre>
	<PrismCode class="language-html">
		{ButtonExampleSource}
	</PrismCode>
</pre>
