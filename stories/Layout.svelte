<script>
  import Col from "../src/Col";
  import Container from "../src/Container.svelte";
  import Row from "../src/Row";
</script>

<Container>
  <div class="mb-3">
    <Row>
      <Col>
        <div class="bg-light rounded border p-2 m-1">.col</div>
      </Col>
    </Row>
    <Row>
      <Col>
        <div class="bg-light rounded border p-2 m-1">.col</div>
      </Col>
      <Col>
        <div class="bg-light rounded border p-2 m-1">.col</div>
      </Col>
      <Col>
        <div class="bg-light rounded border p-2 m-1">.col</div>
      </Col>
      <Col>
        <div class="bg-light rounded border p-2 m-1">.col</div>
      </Col>
    </Row>
    <Row>
      <Col xs="3">
        <div class="bg-light rounded border p-2 m-1">.col-3</div>
      </Col>
      <Col xs="auto">
        <div class="bg-light rounded border p-2 m-1">.col-auto - variable width content</div>
      </Col>
      <Col xs="3">
        <div class="bg-light rounded border p-2 m-1">.col-3</div>
      </Col>
    </Row>
    <Row>
      <Col xs="6">
        <div class="bg-light rounded border p-2 m-1">.col-6</div>
      </Col>
      <Col xs="6">
        <div class="bg-light rounded border p-2 m-1">.col-6</div>
      </Col>
    </Row>
    <Row>
      <Col xs="6" sm="4">
        <div class="bg-light rounded border p-2 m-1">.col-6 .col-sm-4</div>
      </Col>
      <Col xs="6" sm="4">
        <div class="bg-light rounded border p-2 m-1">.col-6 .col-sm-4</div>
      </Col>
      <Col sm="4">
        <div class="bg-light rounded border p-2 m-1">.col-sm-4</div>
      </Col>
    </Row>
    <Row>
      <Col sm={{ size: 6, order: 2, offset: 1 }}>
        <div class="bg-light rounded border p-2 m-1">.col-sm-6 .order-sm-2 .offset-sm-1</div>
      </Col>
    </Row>
    <Row>
      <Col sm="12" md={{ size: 6, offset: 3 }}>
        <div class="bg-light rounded border p-2 m-1">.col-sm-12 .col-md-6 .offset-md-3</div>
      </Col>
    </Row>
    <Row>
      <Col sm={{ size: 'auto', offset: 1 }}>
        <div class="bg-light rounded border p-2 m-1">.col-sm-auto .offset-sm-1</div>
      </Col>
      <Col sm={{ size: 'auto', offset: 1 }}>
        <div class="bg-light rounded border p-2 m-1">.col-sm-auto .offset-sm-1</div>
      </Col>
    </Row>
  </div>

  <div class="mb-3">
    <h3>No Gutters</h3>
    <Row noGutters>
      <Col>
        <div class="bg-light rounded border p-2 m-1">.col</div>
      </Col>
    </Row>
    <Row noGutters>
      <Col>
        <div class="bg-light rounded border p-2 m-1">.col</div>
      </Col>
      <Col>
        <div class="bg-light rounded border p-2 m-1">.col</div>
      </Col>
      <Col>
        <div class="bg-light rounded border p-2 m-1">.col</div>
      </Col>
      <Col>
        <div class="bg-light rounded border p-2 m-1">.col</div>
      </Col>
    </Row>
    <Row noGutters>
      <Col xs="3">
        <div class="bg-light rounded border p-2 m-1">.col-3</div>
      </Col>
      <Col xs="auto">
        <div class="bg-light rounded border p-2 m-1">.col-auto - variable width content</div>
      </Col>
      <Col xs="3">
        <div class="bg-light rounded border p-2 m-1">.col-3</div>
      </Col>
    </Row>
    <Row noGutters>
      <Col xs="6">
        <div class="bg-light rounded border p-2 m-1">.col-6</div>
      </Col>
      <Col xs="6">
        <div class="bg-light rounded border p-2 m-1">.col-6</div>
      </Col>
    </Row>
    <Row noGutters>
      <Col xs="6" sm="4">
        <div class="bg-light rounded border p-2 m-1">.col-6 .col-sm-4</div>
      </Col>
      <Col xs="6" sm="4">
        <div class="bg-light rounded border p-2 m-1">.col-6 .col-sm-4</div>
      </Col>
      <Col sm="4">
        <div class="bg-light rounded border p-2 m-1">.col-sm-4</div>
      </Col>
    </Row>
  </div>
</Container>
