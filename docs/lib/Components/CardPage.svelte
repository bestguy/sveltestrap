<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import CardExample from '../examples/Card';
	const CardExampleSource = require('!!raw-loader!../examples/Card').default;

	import CardContentExample from '../examples/CardContentTypes';
	const CardContentExampleSource = require('!!raw-loader!../examples/CardContentTypes').default;

	import CardSizingExample from '../examples/CardSizing';
	const CardSizingExampleSource = require('!!raw-loader!../examples/CardSizing').default;

	import CardAlignmentExample from '../examples/CardAlignment';
	const CardAlignmentExampleSource = require('!!raw-loader!../examples/CardAlignment').default;

	import CardHeaderFooterExample from '../examples/CardHeaderFooter';
	const CardHeaderFooterExampleSource = require('!!raw-loader!../examples/CardHeaderFooter').default;

	import CardImageCapsExample from '../examples/CardImageCaps';
	const CardImageCapsExampleSource = require('!!raw-loader!../examples/CardImageCaps').default;

	import CardImageOverlayExample from '../examples/CardImageOverlay';
	const CardImageOverlayExampleSource = require('!!raw-loader!../examples/CardImageOverlay').default;

	import CardBackgroundsExample from '../examples/CardBackgrounds';
	const CardBackgroundsExampleSource = require('!!raw-loader!../examples/CardBackgrounds').default;

	import CardOutlineExample from '../examples/CardOutline';
	const CardOutlineExampleSource = require('!!raw-loader!../examples/CardOutline').default;

	import CardGroupsExample from '../examples/CardGroups';
	const CardGroupsExampleSource = require('!!raw-loader!../examples/CardGroups').default;

	import CardDecksExample from '../examples/CardDecks';
	const CardDecksExampleSource = require('!!raw-loader!../examples/CardDecks').default;

	import CardColumnsExample from '../examples/CardColumns';
	const CardColumnsExampleSource = require('!!raw-loader!../examples/CardColumns').default;
</script>

<PageTitle title="Card" />
<hr />
<div class="docs-example">
	<CardExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Content Types</SectionTitle>
<div class="docs-example">
	<CardContentExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardContentExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Sizing</SectionTitle>
<div class="docs-example">
	<CardSizingExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardSizingExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Text alignment</SectionTitle>
<div class="docs-example">
	<CardAlignmentExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardAlignmentExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Header and Footer</SectionTitle>
<div class="docs-example">
	<CardHeaderFooterExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardHeaderFooterExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Image caps</SectionTitle>
<div class="docs-example">
	<CardImageCapsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardImageCapsExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Image overlays</SectionTitle>
<div class="docs-example">
	<CardImageOverlayExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardImageOverlayExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Background variants</SectionTitle>
<div class="docs-example">
	<CardBackgroundsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardBackgroundsExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Outline variants</SectionTitle>
<div class="docs-example">
	<CardOutlineExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardOutlineExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Groups</SectionTitle>
<div class="docs-example">
	<CardGroupsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardGroupsExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Decks</SectionTitle>
<div class="docs-example">
	<CardDecksExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardDecksExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Columns</SectionTitle>
<div class="docs-example">
	<CardColumnsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{CardColumnsExampleSource}
	</PrismCode>
</pre>
