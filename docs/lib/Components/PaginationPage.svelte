<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import PaginationExample from '../examples/Pagination';
	const PaginationExampleSource = require('!!raw-loader!../examples/Pagination').default;

	import PaginationStateExample from '../examples/PaginationState';
	const PaginationStateExampleSource = require('!!raw-loader!../examples/PaginationState').default;

	import PaginationSizingLargeExample from '../examples/PaginationSizingLarge';
	const PaginationSizingLargeExampleSource = require('!!raw-loader!../examples/PaginationSizingLarge').default;

	import PaginationSizingSmallExample from '../examples/PaginationSizingSmall';
	const PaginationSizingSmallExampleSource = require('!!raw-loader!../examples/PaginationSizingSmall').default;
</script>

<PageTitle title="Pagination" />
<div class="docs-example">
	<PaginationExample />
</div>
<pre>
	<PrismCode class="language-html">
		{PaginationExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Disabled and active states</SectionTitle>
<div class="docs-example">
	<PaginationStateExample />
</div>
<pre>
	<PrismCode class="language-html">
		{PaginationStateExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Sizing</SectionTitle>
<div class="docs-example">
	<PaginationSizingLargeExample />
</div>
<pre>
	<PrismCode class="language-html">
		{PaginationSizingLargeExampleSource}
	</PrismCode>
</pre>
<div class="docs-example">
	<PaginationSizingSmallExample />
</div>
<pre>
	<PrismCode class="language-html">
		{PaginationSizingSmallExampleSource}
	</PrismCode>
</pre>
