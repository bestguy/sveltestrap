<script>
	let className = 'h3';
	export { className as class };
	export let title;
</script>

<svelte:head>
	<title>sveltestrap - {title}</title>
</svelte:head>

<h2 class="{className}">
	{title}
</h2>
