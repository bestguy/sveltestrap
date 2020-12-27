<script lang="ts">
  import ToolTip from '../../src/Tooltip.svelte';
  import { Button } from 'sveltestrap';
</script>

<h1>Tooltip</h1>

<Button id="btn-left">LEFT</Button>
<ToolTip target={"btn-left"} placement={"left"}>LEFT</ToolTip>

<Button id="btn-top">TOP</Button>
<ToolTip target={"btn-top"} placement={"top"}>TOP</ToolTip>

<Button id="btn-bottom">BOTTOM</Button>
<ToolTip target={"btn-bottom"} placement={"bottom"}>BOTTOM</ToolTip>


<Button id="btn-right">RIGHT</Button>
<ToolTip target={"btn-right"} placement={"right"}>RIGHT</ToolTip>

