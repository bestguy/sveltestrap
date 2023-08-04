<script lang="ts">
  import { Progress } from 'sveltestrap';
</script>

<Progress value={25} class="mb-2">25%</Progress>
<Progress value={50} class="mb-2">1/2</Progress>
<Progress value={75} class="mb-2">You're almost there!</Progress>
<Progress color="success" value={100} class="mb-2">You did it!</Progress>
<Progress multi class="mb-2">
  <Progress bar value={15}>Meh</Progress>
  <Progress bar color="success" value={30}>Wow!</Progress>
  <Progress bar color="info" value={25}>Cool</Progress>
  <Progress bar color="warning" value={20}>20%</Progress>
  <Progress bar color="danger" value={5}>!!</Progress>
</Progress>
