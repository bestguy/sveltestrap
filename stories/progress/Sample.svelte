<script lang="typescript">
  import { Progress } from 'sveltestrap';
</script>

<div class="text-center">0%</div>
<Progress />
<div class="text-center">25%</div>
<Progress value="25" />
<div class="text-center">50%</div>
<Progress value={50} />
<div class="text-center">75%</div>
<Progress value={75} />
<div class="text-center">100%</div>
<Progress value="100" />
<div class="text-center">Multiple bars</div>
<Progress multi>
  <Progress bar value="15" />
  <Progress bar color="success" value="30" />
  <Progress bar color="info" value="25" />
  <Progress bar color="warning" value="20" />
  <Progress bar color="danger" value="5" />
</Progress>
