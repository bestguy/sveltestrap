<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import { Spinner } from 'sveltestrap';

	import SpinnerExample from '../examples/Spinner';
	const SpinnerExampleSource = require('!!raw-loader!../examples/Spinner').default;

	import SpinnerGrowerExample from '../examples/SpinnerGrower';
	const SpinnerGrowerExampleSource = require('!!raw-loader!../examples/SpinnerGrower').default;
</script>

<PageTitle title="Spinners" />
<div class="docs-example">
	<SpinnerExample />
</div>
<pre>
	<PrismCode class="language-html">{SpinnerExampleSource}</PrismCode>
</pre>
<SectionTitle>Growing Spinner</SectionTitle>
<div class="docs-example">
	<SpinnerGrowerExample />
</div>
<pre>
	<PrismCode class="language-html">
	{SpinnerGrowerExampleSource}
	</PrismCode>
</pre>
<SectionTitle>Sizes</SectionTitle>
<div class="docs-example">
	<Spinner size="sm" color="primary" />
	<Spinner size="sm" color="secondary" />
</div>
<pre>
	<PrismCode class="language-html">
	{`<Spinner size="sm" color="primary" />
<Spinner size="sm" color="secondary" />`}
	</PrismCode>
</pre>
<div class="docs-example">
	<Spinner style={{ width: '3rem', height: '3rem' }} />
	<Spinner style={{ width: '3rem', height: '3rem' }} type="grow" />
</div>
<pre>
	<PrismCode class="language-html">
	{`<Spinner style={{ width: '3rem', height: '3rem' }} />
<Spinner style={{ width: '3rem', height: '3rem' }} type="grow" />`}
	</PrismCode>
</pre>
