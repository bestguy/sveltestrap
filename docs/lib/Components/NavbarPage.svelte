<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import NavbarExample from '../examples/Navbar';
	const NavbarExampleSource = require('!!raw-loader!../examples/Navbar').default;

	import NavbarTogglerExample from '../examples/NavbarToggler';
	const NavbarTogglerExampleSource = require('!!raw-loader!../examples/NavbarToggler').default;
</script>

<PageTitle title="Navbar" />
<div class="docs-example">
	<NavbarExample />
</div>
<pre>
	<PrismCode class="language-html">
		{NavbarExampleSource}
	</PrismCode>
</pre>

<SectionTitle>NavbarToggler</SectionTitle>
<p>
	Place the <code>NavbarToggler</code> <b>after</b> <code>NavbarBrand</code> to have it appear on the right (typical setup).
	Reverse the order to have it appear on the left
</p>
<div class="docs-example">
	<NavbarTogglerExample />
</div>
<pre>
	<PrismCode class="language-html">
		{NavbarTogglerExampleSource}
	</PrismCode>
</pre>
