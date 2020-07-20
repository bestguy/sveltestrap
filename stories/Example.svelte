<script lang="ts">
  import { Col, Row } from 'sveltestrap';
  import PrismCode from './PrismCode.svelte';

  export let stacked = false;
  export let source;
  export let title;
</script>

<div class="py-3">
  {#if title}
    <h2>{title}</h2>
  {/if}
  <slot name="info" />
  <div class="border p-3">
    <h6 class="text-muted">EXAMPLE</h6>
    <Row>
      <Col>
        <slot />
      </Col>
      {#if source}
        <Col xs={stacked ? 12 : undefined}>
          <PrismCode class="language-html h-100">{source}</PrismCode>
        </Col>
      {/if}
    </Row>
  </div>
</div>
