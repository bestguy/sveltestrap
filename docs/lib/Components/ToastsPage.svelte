<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import ToastExample from '../examples/Toast';
	const ToastExampleSource = require('!!raw-loader!../examples/Toast').default;

	import ToastHeaderIconExample from '../examples/ToastHeaderIcon';
	const ToastHeaderIconExampleSource = require('!!raw-loader!../examples/ToastHeaderIcon').default;

	import ToastDismissExample from '../examples/ToastDismiss';
	const ToastDismissExampleSource = require('!!raw-loader!../examples/ToastDismiss').default;
</script>

<PageTitle title="Toasts" />
<div class="docs-example">
	<ToastExample />
</div>
<pre>
	<PrismCode class="language-html">
	{ToastExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Header icons</SectionTitle>
<div class="docs-example">
	<ToastHeaderIconExample />
</div>
<pre>
	<PrismCode class="language-html">
	{ToastHeaderIconExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Dismissing</SectionTitle>
<div class="docs-example">
	<ToastDismissExample buttonLabel="Show toast" />
</div>
<pre>
	<PrismCode class="language-html">
	{ToastDismissExampleSource}
	</PrismCode>
</pre>
