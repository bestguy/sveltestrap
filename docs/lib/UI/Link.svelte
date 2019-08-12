<script>
  import { Link } from 'svelte-routing';
  let className = '';
  export { className as class };
  export let to = '';

  function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
    return {
      class: className
    };
  }
</script>

<Link to="{to}" getProps="{getProps}">
  <slot />
</Link>
