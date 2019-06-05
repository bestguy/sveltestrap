<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';

	import MediaExample from '../examples/Media';
	const MediaExampleSource = require('!!raw-loader!../examples/Media').default;

	import MediaNestedExample from '../examples/MediaNested';
	const MediaNestedExampleSource = require('!!raw-loader!../examples/MediaNested').default;

	import MediaAlignmentExample from '../examples/MediaAlignment';
	const MediaAlignmentExampleSource = require('!!raw-loader!../examples/MediaAlignment').default;

	import MediaListExample from '../examples/MediaList';
	const MediaListExampleSource = require('!!raw-loader!../examples/MediaList').default;
</script>


<PageTitle title="Media object" />
<div class="docs-example">
	<MediaExample />
</div>
<pre>
	<PrismCode class="language-html">
		{MediaExampleSource}
	</PrismCode>
</pre>
	<h4>Nesting</h4>
	<div class="docs-example">
		<MediaNestedExample />
	</div>
	<pre>
	<PrismCode class="language-html">
		{MediaNestedExampleSource}
	</PrismCode>
</pre>
	<h4>Alignment</h4>
	<div class="docs-example">
		<MediaAlignmentExample />
	</div>
	<pre>
	<PrismCode class="language-html">
		{MediaAlignmentExampleSource}
	</PrismCode>
</pre>
	<h4>Media list</h4>
	<div class="docs-example">
		<MediaListExample />
	</div>
	<pre>
	<PrismCode class="language-html">
		{MediaListExampleSource}
	</PrismCode>
</pre>
