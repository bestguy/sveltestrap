<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import JumbotronExample from '../examples/Jumbotron';
	const JumbotronExampleSource = require('!!raw-loader!../examples/Jumbotron').default;

	import JumbotronFluidExample from "../examples/JumbotronFluid";
	const JumbotronFluidExampleSource = require('!!raw-loader!../examples/JumbotronFluid').default;

</script>

<PageTitle title="Jumbotron" />
<hr />
<div class="docs-example">
	<JumbotronExample />
</div>
<pre>
	<PrismCode class="language-html">
	{JumbotronExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Fluid Jumbotron</SectionTitle>
<hr />
<div class="docs-example">
	<JumbotronFluidExample />
</div>
<pre>
	<PrismCode class="language-html">
	{JumbotronFluidExampleSource}
	</PrismCode>
</pre>
