<script>
	import { afterUpdate } from 'svelte';
  import Prism from 'prismjs';

	let className = '';
	let isAsync = false;
	export { className as class };
  export { isAsync as async };

	let _domNode;

	afterUpdate(() => {
		Prism.highlightElement(_domNode, isAsync);
	});
</script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.16.0/themes/prism-okaidia.min.css">

<pre>
	<code class="language-html" bind:this="{_domNode}">
		<slot />
	</code>
</pre>