<script lang="ts">
  import { Button, Toast } from 'sveltestrap';

  let isOpen = false;
</script>

<Button on:click={() => isOpen = true}>
  Show Toast that autohides
</Button>
<Toast autohide body header="Autohides after 5 sec" {isOpen}>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
  consequat.
</Toast>
