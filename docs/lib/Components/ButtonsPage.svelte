<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import { Button } from 'sveltestrap';

	import ButtonExample from '../examples/Button';
	const ButtonExampleSource = require('!!raw-loader!../examples/Button').default;

	import ButtonOutline from '../examples/ButtonOutline';
	const ButtonOutlineSource = require('!!raw-loader!../examples/ButtonOutline').default;

	import ButtonStateful from '../examples/ButtonStateful';
	const ButtonStatefulSource = require('!!raw-loader!../examples/ButtonStateful').default;

	import ButtonCloseIcon from '../examples/ButtonCloseIcon';
	const ButtonCloseIconSource = require('!!raw-loader!../examples/ButtonCloseIcon').default;
</script>

<PageTitle title="Buttons" />
<div class="docs-example">
	<ButtonExample />
</div>
<pre>
	<PrismCode class="language-html">
	{ButtonExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Outline Buttons</SectionTitle>
<div class="docs-example">
	<ButtonOutline />
</div>
<pre>
	<PrismCode class="language-html">
	{ButtonOutlineSource}
	</PrismCode>
</pre>
<SectionTitle>Sizes</SectionTitle>
<div class="docs-example">
	<Button color="primary" size="lg">Large Button</Button>
	<Button color="secondary" size="lg">Large Button</Button>
</div>
<pre>
	<PrismCode class="language-html">
{`<Button color="primary" size="lg">Large Button</Button>
<Button color="secondary" size="lg">Large Button</Button>`}
	</PrismCode>
</pre>
<div class="docs-example">
	<Button color="primary" size="sm">Small Button</Button>
	<Button color="secondary" size="sm">Small Button</Button>
</div>
<pre>
	<PrismCode class="language-html">
{`<Button color="primary" size="sm">Small Button</Button>
<Button color="secondary" size="sm">Small Button</Button>`}
	</PrismCode>
</pre>
<div class="docs-example">
	<Button color="primary" size="lg" block>Block level button</Button>
	<Button color="secondary" size="lg" block>Block level button</Button>
</div>
<pre>
	<PrismCode class="language-html">
{`<Button color="primary" size="lg" block>Block level button</Button>
<Button color="secondary" size="lg" block>Block level button</Button>`}
	</PrismCode>
</pre>
<SectionTitle>Active State</SectionTitle>
<div class="docs-example">
	<Button color="primary" size="lg" active>Primary link</Button>
	<Button color="secondary" size="lg" active>Link</Button>
</div>
<pre>
	<PrismCode class="language-html">
{`<Button color="primary" size="lg" active>Primary link</Button>
<Button color="secondary" size="lg" active>Link</Button>`}
	</PrismCode>
</pre>
<SectionTitle>Disabled State</SectionTitle>
<div class="docs-example">
	<Button color="primary" size="lg" disabled>Primary button</Button>
	<Button color="secondary" size="lg" disabled>Button</Button>
</div>
<pre>
	<PrismCode class="language-html">
{`<Button color="primary" size="lg" disabled>Primary button</Button>
<Button color="secondary" size="lg" disabled>Button</Button>`}
	</PrismCode>
</pre>

<SectionTitle>Checkbox and Radio Buttons (Stateful Buttons)</SectionTitle>
<p>
	In order to have checkbox and radio buttons, your component needs to manage the state of which button(s) are active/select. It is not in the opinion of this library to manage state within it's components so it is left up to you. Below is a simple example showcasing how this could be done using the components which already exist in this library.
</p>
<div class="docs-example">
	<ButtonStateful />
</div>
<pre>
	<PrismCode class="language-html">
	{ButtonStatefulSource}
	</PrismCode>
</pre>

<SectionTitle>Close icon</SectionTitle>
<p>
	Use a generic close icon to dismiss content. Use <code>&lt;Button close /&gt;</code> for the default icon. Otherwise, custom content for the button
	may be defined. (e.g. JSX: <code>&lt;Button close&gt;&lt;span aria-hidden="true"&gt;&ndash;&lt;/span&gt;&lt;/Button&gt;</code>) The default aria-label is "Close".
</p>
<div class="docs-example">
	<ButtonCloseIcon />
</div>
<pre>
	<PrismCode class="language-html">
	{ButtonCloseIconSource}
	</PrismCode>
</pre>
