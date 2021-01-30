<script lang="ts">
  import { Col, Container, Row } from 'sveltestrap';

  const cell = 'bg-white rounded m-1 small p-2';
  const row = 'bg-secondary rounded mb-2';
</script>

<Container fluid>
  <Row noGutters class={row}>
    <Col>
      <div class={cell}>.col</div>
    </Col>
  </Row>
  <Row noGutters class={row}>
    <Col>
      <div class={cell}>.col</div>
    </Col>
    <Col>
      <div class={cell}>.col</div>
    </Col>
    <Col>
      <div class={cell}>.col</div>
    </Col>
    <Col>
      <div class={cell}>.col</div>
    </Col>
  </Row>
  <Row noGutters class={row}>
    <Col xs="3">
      <div class={cell}>.col-3</div>
    </Col>
    <Col xs="auto">
      <div class={cell}>.col-auto - variable width content</div>
    </Col>
    <Col xs="3">
      <div class={cell}>.col-3</div>
    </Col>
  </Row>
  <Row noGutters class={row}>
    <Col xs="6">
      <div class={cell}>.col-6</div>
    </Col>
    <Col xs="6">
      <div class={cell}>.col-6</div>
    </Col>
  </Row>
  <Row noGutters class={row}>
    <Col xs="6" sm="4">
      <div class={cell}>.col-6 .col-sm-4</div>
    </Col>
    <Col xs="6" sm="4">
      <div class={cell}>.col-6 .col-sm-4</div>
    </Col>
    <Col sm="4">
      <div class={cell}>.col-sm-4</div>
    </Col>
  </Row>
  <Row noGutters class={row}>
    <Col sm={{ size: 6, order: 2, offset: 1 }}>
      <div class={cell}>.col-sm-6 .order-sm-2 .offset-sm-1</div>
    </Col>
  </Row>
  <Row noGutters class={row}>
    <Col sm="12" md={{ size: 6, offset: 3 }}>
      <div class={cell}>.col-sm-1 rounded2 .col-md-6 .offset-md-3</div>
    </Col>
  </Row>
  <Row noGutters class={row}>
    <Col sm={{ size: 'auto', offset: 1 }}>
      <div class={cell}>.col-sm-auto .offset-sm-1</div>
    </Col>
    <Col sm={{ size: 'auto', offset: 1 }}>
      <div class={cell}>.col-sm-auto .offset-sm-1</div>
    </Col>
  </Row>
  <Row cols="2">
    <Col>col-1</Col>
    <Col>col-2</Col>      
    <Col>col-3</Col>    
    <Col>col-4</Col>    
  </Row>
  <Row cols="{{ md: 3 }}">
    <Col>col-1</Col>
    <Col>col-2</Col>      
    <Col>col-3</Col>    
    <Col>col-4</Col>    
  </Row>
</Container>
