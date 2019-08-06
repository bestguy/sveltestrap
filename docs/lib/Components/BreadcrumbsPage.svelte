<script>
	import PrismCode from '../UI/PrismCode.svelte';
	import PageTitle from '../UI/PageTitle.svelte';
	import SectionTitle from '../UI/SectionTitle.svelte';


	import BreadcrumbExample from '../examples/Breadcrumb';
	const BreadcrumbExampleSource = require('!!raw-loader!../examples/Breadcrumb').default;

	import BreadcrumbNoListExample from '../examples/BreadcrumbNoList';
	const BreadcrumbNoListExampleSource = require('!!raw-loader!../examples/BreadcrumbNoList').default;
</script>

<PageTitle title="Breadcrumbs" />
<div class="docs-example">
	<BreadcrumbExample />
</div>
<pre>
	<PrismCode class="language-html">
		{BreadcrumbExampleSource}
	</PrismCode>
</pre>
<!--<h4>Properties</h4>-->
<!--<pre>-->
<!--	<PrismCode class="language-html">-->
<!--{`Breadcrumb.propTypes = {-->
<!--  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),-->
<!--  listTag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),-->
<!--  className: PropTypes.string,-->
<!--  listClassName: PropTypes.string,-->
<!--  cssModule: PropTypes.object,-->
<!--  children: PropTypes.node,-->
<!--  'aria-label': PropTypes.string-->
<!--};-->
<!--BreadcrumbItem.propTypes = {-->
<!--  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),-->
<!--  active: PropTypes.bool,-->
<!--  className: PropTypes.string,-->
<!--  cssModule: PropTypes.object,-->
<!--};-->
<!--`}-->
<!--	</PrismCode>-->
<!--</pre>-->
<!--<SectionTitle>No list</SectionTitle>-->
<!--<hr />-->
<!--<p>Breadcrumbs can work without the usage of list markup.</p>-->
<!--<div class="docs-example">-->
<!--	<BreadcrumbNoListExample />-->
<!--</div>-->
<!--<pre>-->
<!--	<PrismCode class="language-html">-->
<!--		{BreadcrumbNoListExampleSource}-->
<!--	</PrismCode>-->
<!--</pre>-->
