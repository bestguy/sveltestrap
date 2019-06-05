<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import NavsExample from '../examples/Navs';
	const NavsExampleSource = require('!!raw-loader!../examples/Navs').default;

	import NavVerticalExample from '../examples/NavVertical';
	const NavVerticalExampleSource = require('!!raw-loader!../examples/NavVertical').default;

	import NavTabsExample from '../examples/NavTabs';
	const NavTabsExampleSource = require('!!raw-loader!../examples/NavTabs').default;

	import NavPillsExample from '../examples/NavPills';
	const NavPillsExampleSource = require('!!raw-loader!../examples/NavPills').default;

</script>

<PageTitle title="Nav" />
<div class="docs-example">
	<NavsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{NavsExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Vertical</SectionTitle>
<div class="docs-example">
	<NavVerticalExample />
</div>
<pre>
	<PrismCode class="language-html">
		{NavVerticalExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Tabs</SectionTitle>
<div class="docs-example">
	<NavTabsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{NavTabsExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Pills</SectionTitle>
<div class="docs-example">
	<NavPillsExample />
</div>
<pre>
	<PrismCode class="language-html">
		{NavPillsExampleSource}
	</PrismCode>
</pre>
