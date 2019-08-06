<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import BadgeExample from '../examples/Badge';
	const BadgeExampleSource = require('!!raw-loader!../examples/Badge').default;

	import BadgeButtonExample from '../examples/BadgeButton';
	const BadgeButtonExampleSource = require('!!raw-loader!../examples/BadgeButton').default;

	import BadgePillsExample from '../examples/BadgePills';
	const BadgePillsExampleSource = require('!!raw-loader!../examples/BadgePills').default;

	import BadgeVariationsExample from '../examples/BadgeVariations';
	const BadgeVariationsExampleSource = require('!!raw-loader!../examples/BadgeVariations').default;

	import BadgeLinksExample from '../examples/BadgeLinks';
	const BadgeLinksExampleSource = require('!!raw-loader!../examples/BadgeLinks').default;
</script>

<PageTitle title="Badges" />
<hr />
<p>Scale to parent</p>
<div class="docs-example">
	<BadgeExample />
</div>
<pre>
	<PrismCode class="language-html">
		{BadgeExampleSource}
	</PrismCode>
</pre>
<p>Badges can be used as part of links or buttons to provide a counter.</p>
<div class="docs-example">
	<BadgeButtonExample />
</div>
<pre>
<PrismCode class="language-html">
	{BadgeButtonExampleSource}
</PrismCode>
</pre>
<SectionTitle>Contextual variations</SectionTitle>
<div class="docs-example">
	<BadgeVariationsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{BadgeVariationsExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Pills</SectionTitle>
<div class="docs-example">
	<BadgePillsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{BadgePillsExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Links</SectionTitle>
<p>Adding the <code>href</code> prop will default the badge to a link.</p>
<div class="docs-example">
	<BadgeLinksExample />
</div>
<pre>
	<PrismCode class="language-html">
		{BadgeLinksExampleSource}
	</PrismCode>
</pre>
