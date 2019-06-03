<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import TableExample from '../examples/Table';
	const TableExampleSource = require('!!raw-loader!../examples/Table').default;

	import TableBorderedExample from '../examples/TableBordered';
	const TableBorderedExampleSource = require('!!raw-loader!../examples/TableBordered').default;

	import TableBorderlessExample from '../examples/TableBorderless';
	const TableBorderlessExampleSource = require('!!raw-loader!../examples/TableBorderless').default;

	import TableHoverExample from '../examples/TableHover';
	const TableHoverExampleSource = require('!!raw-loader!../examples/TableHover').default;

	import TableDarkExample from '../examples/TableDark';
	const TableDarkExampleSource = require('!!raw-loader!../examples/TableDark').default;

	import TableResponsiveExample from '../examples/TableResponsive';
	const TableResponsiveExampleSource = require('!!raw-loader!../examples/TableResponsive').default;

	import TableSizingExample from '../examples/TableSizing';
	const TableSizingExampleSource = require('!!raw-loader!../examples/TableSizing').default;

	import TableStripedExample from '../examples/TableStriped';
	const TableStripedExampleSource = require('!!raw-loader!../examples/TableStriped').default;
</script>

<PageTitle title="Tables" />
<hr />
<div class="docs-example">
	<TableExample />
</div>
<pre>
	<PrismCode class="language-html">
	{TableExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Dark table</SectionTitle>
<div class="docs-example">
	<TableDarkExample />
</div>
<pre>
	<PrismCode class="language-html">
	{TableDarkExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Striped rows</SectionTitle>
<div class="docs-example">
	<TableStripedExample />
</div>
<pre>
	<PrismCode class="language-html">
	{TableStripedExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Bordered table</SectionTitle>
<div class="docs-example">
	<TableBorderedExample />
</div>
<pre>
	<PrismCode class="language-html">
	{TableBorderedExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Borderless table</SectionTitle>
<div class="docs-example">
	<TableBorderlessExample />
</div>
<pre>
	<PrismCode class="language-html">
	{TableBorderlessExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Hoverable rows</SectionTitle>
<div class="docs-example">
	<TableHoverExample />
</div>
<pre>
	<PrismCode class="language-html">
	{TableHoverExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Small table</SectionTitle>
<div class="docs-example">
	<TableSizingExample />
</div>
<pre>
	<PrismCode class="language-html">
	{TableSizingExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Responsive table</SectionTitle>
<div class="docs-example">
	<TableResponsiveExample />
</div>
<pre>
	<PrismCode class="language-html">
	{TableResponsiveExampleSource}
	</PrismCode>
</pre>
