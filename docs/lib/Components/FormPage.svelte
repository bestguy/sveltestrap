<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';

	import FormExample from '../examples/Form';
	const FormExampleSource = require('!!raw-loader!../examples/Form').default;

	import FormGridExample from '../examples/FormGrid';
	const FormGridExampleSource = require('!!raw-loader!../examples/FormGrid').default;

	import FormGridFormRowExample from '../examples/FormGridFormRow';
	const FormGridFormRowExampleSource = require('!!raw-loader!../examples/FormGridFormRow').default;

	// import FormInlineExample from '../examples/FormInline';
	// const FormInlineExampleSource = require('!!raw-loader!../examples/FormInline').default;
	//
	// import FormFeedbackExample from '../examples/FormFeedback';
	// const FormFeedbackExampleSource = require('!!raw-loader!../examples/FormFeedback').default;
	//
	// import InputTypeExample from '../examples/InputType';
	// const InputTypeExampleSource = require('!!raw-loader!../examples/InputType').default;
	//
	// import InlineCheckboxesExample from '../examples/InlineCheckboxes';
	// const InlineCheckboxesExampleSource = require('!!raw-loader!../examples/InlineCheckboxes').default;
	//
	// import InputSizingExample from '../examples/InputSizing';
	// const InputSizingExampleSource = require('!!raw-loader!../examples/InputSizing').default;
	//
	// import InputGridSizingExample from '../examples/InputGridSizing';
	// const InputGridSizingExampleSource = require('!!raw-loader!../examples/InputGridSizing').default;
	//
	// import LabelHiddenExample from '../examples/LabelHidden';
	// const LabelHiddenExampleSource = require('!!raw-loader!../examples/LabelHidden').default;
	//
	// import CustomControlsExample from '../examples/CustomControls';
	// const CustomControlsExampleSource = require('!!raw-loader!../examples/CustomControls').default;
</script>

<PageTitle title="Form" />
<div class="docs-example">
	<FormExample />
</div>
<pre>
	<PrismCode class="language-html">
		{FormExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Form Grid</SectionTitle>
<div class="docs-example">
	<FormGridExample />
</div>
<pre>
	<PrismCode class="language-html">
		{FormGridExampleSource}
	</PrismCode>
</pre>

<SectionTitle>Form Grid with Form Row</SectionTitle>
<div class="docs-example">
	<FormGridFormRowExample />
</div>
<pre>
	<PrismCode class="language-html">
		{FormGridFormRowExampleSource}
	</PrismCode>
</pre>

<!--<SectionTitle>Inline Form</SectionTitle>-->
<!--<div class="docs-example">-->
<!--	<FormInlineExample />-->
<!--</div>-->
<!--<pre>-->
<!--	<PrismCode class="language-html">-->
<!--		{FormInlineExampleSource}-->
<!--	</PrismCode>-->
<!--</pre>-->

<!--<SectionTitle>Form Validation</SectionTitle>-->
<!--<div class="docs-example">-->
<!--	<FormFeedbackExample />-->
<!--</div>-->
<!--<pre>-->
<!--	<PrismCode class="language-html">-->
<!--		{FormFeedbackExampleSource}-->
<!--	</PrismCode>-->
<!--</pre>-->

<!--<SectionTitle>Input Types</SectionTitle>-->
<!--<div class="docs-example">-->
<!--	<InputTypeExample />-->
<!--</div>-->
<!--<pre>-->
<!--	<PrismCode class="language-html">-->
<!--		{InputTypeExampleSource}-->
<!--	</PrismCode>-->
<!--</pre>-->

<!--<SectionTitle>Inline checkboxes</SectionTitle>-->
<!--<div class="docs-example">-->
<!--	<InlineCheckboxesExample />-->
<!--</div>-->
<!--<pre>-->
<!--	<PrismCode class="language-html">-->
<!--		{InlineCheckboxesExampleSource}-->
<!--	</PrismCode>-->
<!--</pre>-->

<!--<SectionTitle>Input Sizing</SectionTitle>-->
<!--<div class="docs-example">-->
<!--	<InputSizingExample />-->
<!--</div>-->
<!--<pre>-->
<!--	<PrismCode class="language-html">-->
<!--		{InputSizingExampleSource}-->
<!--	</PrismCode>-->
<!--</pre>-->

<!--<SectionTitle>Input Grid Sizing</SectionTitle>-->
<!--<div class="docs-example">-->
<!--	<InputGridSizingExample />-->
<!--</div>-->
<!--<pre>-->
<!--	<PrismCode class="language-html">-->
<!--		{InputGridSizingExampleSource}-->
<!--	</PrismCode>-->
<!--</pre>-->

<!--<SectionTitle>Hidden Labels</SectionTitle>-->
<!--<div class="docs-example">-->
<!--	<LabelHiddenExample />-->
<!--</div>-->
<!--<pre>-->
<!--	<PrismCode class="language-html">-->
<!--		{LabelHiddenExampleSource}-->
<!--	</PrismCode>-->
<!--</pre>-->

<!--<SectionTitle>Custom Inputs</SectionTitle>-->
<!--<div class="docs-example">-->
<!--	<CustomControlsExample />-->
<!--</div>-->
<!--<pre>-->
<!--	<PrismCode class="language-html">-->
<!--		{CustomControlsExampleSource}-->
<!--	</PrismCode>-->
<!--</pre>-->
