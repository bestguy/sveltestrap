<script>
  import classnames from './utils';
  import Container from './Container.svelte';

  let className = '';
  export { className as class };
  export let container = 'fluid';
  export let color = '';
  export let dark = false;
  export let expand = false || '';
  export let fixed = '';
  export let light = false;
  export let sticky = '';

  function getExpandClass(expand) {
    if (expand === false) {
      return false;
    } else if (expand === true || expand === 'xs') {
      return 'navbar-expand';
    }

    return `navbar-expand-${expand}`;
  }

  $: classes = classnames(className, 'navbar', getExpandClass(expand), {
    'navbar-light': light,
    'navbar-dark': dark,
    [`bg-${color}`]: color,
    [`fixed-${fixed}`]: fixed,
    [`sticky-${sticky}`]: sticky
  });
</script>

<nav {...$$restProps} class={classes}>
  {#if container}
    <Container fluid={container === 'fluid'}>
      <slot />
    </Container>
  {:else}
    <slot />
  {/if}
</nav>
