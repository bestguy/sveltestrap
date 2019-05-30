<script>
	import {Alert} from 'sveltestrap';

	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import AlertExample from '../examples/Alert.svelte';
	const AlertExampleSource = require('!!raw-loader!../examples/Alert.svelte').default;

	import AlertLinkExample from '../examples/AlertLink.svelte';
	const AlertLinkExampleSource = require('!!raw-loader!../examples/AlertLink.svelte').default;

	import AlertContentExample from '../examples/AlertContent.svelte';
	const AlertContentExampleSource = require('!!raw-loader!../examples/AlertContent.svelte').default;

	import AlertDismissExample from '../examples/AlertDismiss.svelte';
	const AlertDismissExampleSource = require('!!raw-loader!../examples/AlertDismiss.svelte').default;

	import AlertUncontrolledDismissExample from '../examples/AlertUncontrolledDismiss.svelte';
	const AlertUncontrolledDismissExampleSource = require('!!raw-loader!../examples/AlertUncontrolledDismiss').default;

	import AlertFadelessExample from '../examples/AlertFadeless.svelte';
	const AlertFadelessExampleSource = require('!!raw-loader!../examples/AlertFadeless.svelte').default;
</script>

<div>
	<PageTitle title="Alerts"/>
	<div class="docs-example">
		<AlertExample/>
	</div>
	<pre>
		<PrismCode class="language-jsx">
			{AlertExampleSource}
		</PrismCode>
    </pre>
	<SectionTitle>Link color</SectionTitle>
	<div class="docs-example">
		<AlertLinkExample/>
	</div>
	<pre>
		<PrismCode class="language-jsx">
			{AlertLinkExampleSource}
		</PrismCode>
    </pre>
	<SectionTitle>Additional content</SectionTitle>
	<div class="docs-example">
		<AlertContentExample/>
	</div>
	<pre>
		<PrismCode class="language-jsx">
			{AlertContentExampleSource}
		</PrismCode>
    </pre>
	<SectionTitle>Dismissing</SectionTitle>
	<div class="docs-example">
		<AlertDismissExample/>
	</div>
	<pre>
		<PrismCode class="language-jsx">
			{AlertDismissExampleSource}
		</PrismCode>
    </pre>
	<SectionTitle>Uncontrolled [disable] Alerts</SectionTitle>
	<p>
		For the most basic use-case an uncontrolled component can provide the functionality wanted without the need to
		manage/control the state of the component. <code>UncontrolledAlert</code> does not require <code>isOpen</code>
		nor
		<code>toggle</code> props to work.
	</p>
	<div class="docs-example">
		<AlertUncontrolledDismissExample/>
	</div>
	<pre>
		<PrismCode class="language-jsx">
			{AlertUncontrolledDismissExampleSource}
		</PrismCode>
    </pre>
	<SectionTitle>Alerts without fade</SectionTitle>
	<p>
		Fade can be disabled using <code>fade=false</code>.
	</p>
	<div class="docs-example">
		<AlertFadelessExample/>
	</div>
	<pre>
		<PrismCode class="language-jsx">
			{AlertFadelessExampleSource}
		</PrismCode>
    </pre>
</div>
