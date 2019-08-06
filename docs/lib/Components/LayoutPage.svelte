<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import LayoutExample from '../examples/Layout';
	const LayoutExampleSource = require('!!raw-loader!../examples/Layout').default;
</script>

<PageTitle title="Layout Components (Container, Row, Col)" />
<div class="docs-example">
	<LayoutExample />
</div>
<pre>
	<PrismCode class="language-html">
		{LayoutExampleSource}
	</PrismCode>
</pre>
