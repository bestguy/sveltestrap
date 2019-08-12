<script>
  import PrismCode from "../UI/PrismCode.svelte";
  import PageTitle from "../UI/PageTitle.svelte";

  import ModalExample from "../examples/Modal";
  const ModalExampleSource = require("!!raw-loader!../examples/Modal").default;
</script>

<PageTitle title="Modal" />
<div class="docs-example">
  <ModalExample />
</div>
<pre>
  <PrismCode class="language-html">{ModalExampleSource}</PrismCode>
</pre>
