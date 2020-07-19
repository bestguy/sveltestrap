<script lang="typescript">
  import { Navbar, NavbarBrand } from 'sveltestrap';

  const colors = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ];
</script>

{#each colors as color}
  <Navbar
    {color}
    dark={color === 'dark' || color === 'primary'}
    light={color !== 'dark' && color !== 'primary'}
    class="mb-2">
    <NavbarBrand href="/">{color} Navbar</NavbarBrand>
  </Navbar>
{/each}
