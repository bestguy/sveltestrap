<script>
  import { Button } from 'sveltestrap';
  const handleClick = () => alert('I warned you!');
</script>

<Button color="danger" on:click={handleClick}>Do Not Press</Button>
