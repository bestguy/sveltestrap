<script>
	import { afterUpdate } from 'svelte';
	
	let className = '';
	export { className as class };
	let isAsync = false;
	export { isAsync as async };

	let _domNode;

	afterUpdate(() => {
		Prism.highlightElement(_domNode, isAsync);
	});
</script>

<code class="{className}" bind:this="{_domNode}">
	<slot />
</code>
