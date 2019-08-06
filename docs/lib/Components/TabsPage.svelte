<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import TabsExample from '../examples/Tabs';
	const TabsExampleSource = require('!!raw-loader!../examples/Tabs').default;
</script>

<PageTitle title="Tabs" />
<hr />
<div class="docs-example">
	<TabsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{TabsExampleSource}
	</PrismCode>
</pre>
