<script>
  import { Button, Container, Row, Col, Jumbotron } from 'sveltestrap';
  import PrismCode from '../PrismCode.svelte';
  import Example from '../Example.svelte';
  import Sample from './Sample.svelte';
  import sampleSource from '!!raw-loader!./Sample.svelte';
</script>

<div>
  <Jumbotron tag="section" class="jumbotron-header text-center mb-3">
    <Container>
      <Row>
        <Col>
          <h1 class="jumbotron-heading display-4">sveltestrap</h1>
          <p class="lead">
            Easy to use Svelte Bootstrap 4 components based on
            <a
              href="https://github.com/reactstrap/reactstrap"
              target="_blank"
              rel="noopener nofollow">
              reactstrap
            </a>
            .
          </p>
          <p>
            <Button
              outline
              color="danger"
              href="https://github.com/bestguy/sveltestrap">
              GitHub
            </Button>
            <Button
              color="danger"
              href="https://bestguy.github.io/sveltestrap/?path=/story/components--layout">
              Components
            </Button>
          </p>
        </Col>
      </Row>
    </Container>
  </Jumbotron>
  <Container>
    <Row class="justify-content-sm-center">
      <Col sm={8} class="docSearch-content">
        <h2>Installation</h2>
        <hr />
        <h3 class="mt-5">NPM</h3>
        <p>Install sveltestrap and peer dependencies via NPM</p>
        <pre>
          <PrismCode class="language-bash">
            npm install --save sveltestrap svelte
          </PrismCode>
        </pre>
        <p>Import the components you need</p>
        <Example source={sampleSource}>
          <Sample />
        </Example>

        <h4>Adding Bootstrap</h4>
        <p>
          Sveltestrap does not include or embed Bootstrap CSS so this needs to
          be installed by you, either by including Bootstrap CSS to your layout
          (1) , or installed from npm (2).
        </p>

        <h5>1. Include in layout</h5>

        <h6>Either static HTML layout</h6>
        <pre>
          <PrismCode class="language-html">
            {`<head>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
</head>`}
          </PrismCode>
        </pre>

        <h6>or add from your Svelte app</h6>
        <pre>
          <PrismCode class="language-html">
            {`<svelte:head>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
</svelte:head>`}
          </PrismCode>
        </pre>

        <p>
          You can also use any Bootstrap 4 compatible theme instead of the
          default Bootstrap theme. For example:
          <a href="https://www.bootstrapcdn.com/bootswatch/" target="new">
            https://www.bootstrapcdn.com/bootswatch/
          </a>
        </p>

        <h5>2. Install via npm</h5>
        <pre>
          <PrismCode class="language-bash">
            {`npm install --save bootstrap`}
          </PrismCode>
        </pre>
        <p>
          Import Bootstrap CSS in the
          <code>src/index.js</code>
          file:
        </p>
        <pre>
          <PrismCode class="language-javascript">
            import 'bootstrap/dist/css/bootstrap.min.css';
          </PrismCode>
        </pre>

        <h3>Using in Svelte app</h3>
        <p>
          Import required sveltestrap components within
          <code>src/App.svelte</code>
          file or your custom component files:
        </p>
        <pre>
          <PrismCode class="language-javascript">
            {`import { Button } from 'sveltestrap';`}
          </PrismCode>
        </pre>
        <p>
          Now you are ready to use the imported sveltestrap components within
          your component hierarchy.
        </p>

        <h4>Server-side Rendering (SSR) Note:</h4>
        <p>
          If you are using Sveltestrap in an SSR environment (such as Sapper),
          it's recommended you import the component src directly:
        </p>
        <pre>
          <PrismCode class="language-javascript">
            {`import Card from 'sveltestrap/src/Card.svelte'`}
          </PrismCode>
        </pre>

        <h2 class="mt-5">About the Project</h2>
        <hr />
        <p>
          This library contains Svelte 3 Bootstrap 4 components that favor
          composition and control. The library does not depend on jQuery or
          Bootstrap javascript.
        </p>
      </Col>
    </Row>
  </Container>
</div>
