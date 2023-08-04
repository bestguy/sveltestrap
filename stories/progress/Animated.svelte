<script lang="ts">
  import { Progress } from 'sveltestrap';
</script>

<Progress animated value={2 * 5} class="mb-2" />
<Progress animated color="success" value={25} class="mb-2" />
<Progress animated color="info" value={50} class="mb-2" />
<Progress animated color="warning" value={75} class="mb-2" />
<Progress animated color="danger" value={100} class="mb-2" />
<Progress multi class="mb-2">
  <Progress animated bar value={10} />
  <Progress animated bar color="success" value={30} />
  <Progress animated bar color="warning" value={20} />
  <Progress animated bar color="danger" value={20} />
</Progress>
